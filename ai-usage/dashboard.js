/* Pure CSV and aggregation helpers also run in Node's standard-library tests. */
((root) => {
  const required = ["task_id", "session_id", "agent", "model", "measurement_source", "aggregation_scope"];
  const tokenFields = ["input_tokens", "output_tokens", "cached_input_tokens", "cache_write_input_tokens"];
  const priorities = { "codex.response": 30, "codex.rollout_total": 20, "codex.exec": 10, "claude.message": 30, "claude.result": 10 };

  function parseCSV(text) {
    if (!text.trim()) return [];
    const matrix = [];
    let row = [], field = "", quoted = false, closed = false;
    text = text.replace(/^\uFEFF/, "");
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (quoted) {
        if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (char === '"') { quoted = false; closed = true; }
        else field += char;
      } else if (char === '"') {
        if (field || closed) throw new Error("Invalid CSV quoting");
        quoted = true;
      } else if (char === ",") {
        row.push(field); field = ""; closed = false;
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && text[i + 1] === "\n") i++;
        row.push(field); matrix.push(row); row = []; field = ""; closed = false;
      } else {
        if (closed) throw new Error("Unexpected text after CSV quote");
        field += char;
      }
    }
    if (quoted) throw new Error("Unclosed CSV quote");
    if (field || closed || row.length) { row.push(field); matrix.push(row); }
    const header = matrix.shift();
    if (!header || new Set(header).size !== header.length || required.some((key) => !header.includes(key))) throw new Error("CSV schema is missing required columns");
    const records = [];
    let invalidRows = 0;
    for (const cells of matrix.filter((values) => values.some((value) => value !== ""))) {
      const record = Object.fromEntries(header.map((key, i) => [key, cells[i]]));
      const numericFields = [...tokenFields, "reasoning_output_tokens", "provider_cost_usd", "estimated_cost_usd"];
      const validNumbers = numericFields.every((key) => !record[key] || (/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(record[key]) && Number.isFinite(Number(record[key])) && Number(record[key]) >= 0 && (!key.endsWith("tokens") || Number.isSafeInteger(Number(record[key])))));
      const valid = cells.length === header.length && ["task_id", "session_id", "agent", "measurement_source"].every((key) => record[key]) && ["exclusive", "inclusive", "unknown"].includes(record.aggregation_scope) && validNumbers && (!record.provider_cost_usd || record.cost_status === "provider_reported") && (!record.estimated_cost_usd || ["calculated", "reported_estimate", "provider_reported"].includes(record.cost_status));
      if (valid) records.push(record);
      else invalidRows++;
    }
    Object.defineProperty(records, "invalidRows", { value: invalidRows });
    return records;
  }

  function selectRows(rows) {
    const exact = new Map();
    for (const row of rows) {
      const key = JSON.stringify([row.agent, row.session_id, row.model, row.measurement_source]);
      const old = exact.get(key);
      if (!old || (row.datetime || "") >= (old.datetime || "")) exact.set(key, row);
    }
    const best = new Map();
    for (const row of exact.values()) {
      if (row.aggregation_scope !== "exclusive") continue;
      const key = JSON.stringify([row.agent, row.session_id]);
      const score = priorities[row.measurement_source] || 0;
      const existing = best.get(key);
      if (!existing || score > existing.score || (score === existing.score && row.measurement_source < existing.source)) best.set(key, { score, source: row.measurement_source });
    }
    return [...exact.values()].filter((row) => row.aggregation_scope === "exclusive" && best.get(JSON.stringify([row.agent, row.session_id]))?.source === row.measurement_source);
  }

  function metric(rows, field) {
    const known = rows.filter((row) => row[field] !== undefined && row[field] !== "");
    return { value: known.reduce((sum, row) => sum + Number(row[field]), 0), known: known.length, complete: known.length, total: rows.length };
  }

  function totalTokens(rows) {
    const result = { value: 0, known: 0, complete: 0, total: rows.length };
    for (const row of rows) {
      // OpenAI input includes cache reads. Anthropic input excludes cache read/write.
      const fields = row.agent === "codex" ? ["input_tokens", "output_tokens"] : row.agent === "claude" ? tokenFields : [];
      const available = fields.filter((key) => row[key] !== undefined && row[key] !== "");
      result.value += available.reduce((sum, key) => sum + Number(row[key]), 0);
      if (available.length) result.known++;
      if (fields.length && available.length === fields.length) result.complete++;
    }
    return result;
  }

  function summarize(rows) {
    const selected = selectRows(rows);
    const tasks = new Map();
    for (const row of rows) {
      if (!tasks.has(row.task_id)) tasks.set(row.task_id, { id: row.task_id, description: row.task_description || "", rows: [], excluded: 0, uncovered: 0 });
      if (!tasks.get(row.task_id).description && row.task_description) tasks.get(row.task_id).description = row.task_description;
    }
    const included = new Set(selected);
    const coveredSessions = new Set(selected.map((row) => JSON.stringify([row.agent, row.session_id])));
    for (const row of rows) {
      const task = tasks.get(row.task_id);
      if (included.has(row)) task.rows.push(row);
      else {
        task.excluded++;
        if (!coveredSessions.has(JSON.stringify([row.agent, row.session_id]))) task.uncovered++;
      }
    }
    for (const task of tasks.values()) {
      task.tokens = totalTokens(task.rows);
      task.input = metric(task.rows, "input_tokens");
      task.provider = metric(task.rows, "provider_cost_usd");
      task.estimate = metric(task.rows, "estimated_cost_usd");
      task.partial = task.uncovered > 0 || (rows.invalidRows || 0) > 0 || task.rows.some((row) => row.completeness !== "reported_complete" || !row.model) || task.tokens.complete < task.tokens.total;
    }
    return { selected, tasks: [...tasks.values()] };
  }

  const api = { parseCSV, selectRows, metric, totalTokens, summarize };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.UsageDashboard = api;
  if (typeof document === "undefined") return;

  const $ = (id) => document.getElementById(id);
  function displayMetric(data, money = false) {
    if (!data.known) return "Unknown";
    const value = money ? `$${data.value.toFixed(4)}` : new Intl.NumberFormat("en-US").format(data.value);
    return data.complete < data.total ? `${value} · incomplete` : value;
  }
  function cell(row, text) { const td = document.createElement("td"); td.textContent = text; row.append(td); }
  function paint(records) {
    const { selected, tasks } = summarize(records);
    $("token-total").textContent = displayMetric(totalTokens(selected));
    $("provider-total").textContent = displayMetric(metric(selected, "provider_cost_usd"), true);
    $("estimate-total").textContent = displayMetric(metric(selected, "estimated_cost_usd"), true);
    $("tasks").replaceChildren();
    for (const task of tasks) {
      const row = document.createElement("tr");
      cell(row, `${task.id}${task.description ? ` — ${task.description}` : ""}`);
      cell(row, displayMetric(task.tokens));
      cell(row, displayMetric(task.provider, true));
      cell(row, displayMetric(task.estimate, true));
      cell(row, `${task.partial ? "Incomplete" : "Reported complete"}${task.excluded ? ` · ${task.excluded} excluded` : ""}`);
      $("tasks").append(row);
    }
    $("empty").hidden = records.length > 0;
    const invalid = records.invalidRows || 0;
    const incomplete = invalid > 0 || tasks.some((task) => task.partial);
    $("status").textContent = `${incomplete ? "Incomplete · " : ""}${records.length} valid records · ${selected.length} included${invalid ? ` · ${invalid} invalid rows skipped` : ""} · refreshed ${new Date().toLocaleTimeString()}`;
  }
  async function refresh() {
    $("refresh").disabled = true;
    try {
      const response = await fetch(`usage.csv?refresh=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Cannot load usage.csv (HTTP ${response.status})`);
      paint(parseCSV(await response.text()));
      $("status").className = "status";
    } catch (error) {
      paint([]);
      $("status").textContent = `${error.message}. Run pnpm ai-usage:serve from the repository root.`;
      $("status").className = "status error";
    } finally { $("refresh").disabled = false; }
  }
  $("refresh").addEventListener("click", refresh);
  refresh();
})(globalThis);
