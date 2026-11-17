import assert from "node:assert/strict";
import test from "node:test";
import "../dashboard.js";

const { parseCSV, selectRows, totalTokens, summarize } = globalThis.UsageDashboard;
const header = "task_id,session_id,agent,model,measurement_source,aggregation_scope,task_description,input_tokens,output_tokens,cached_input_tokens,cache_write_input_tokens,provider_cost_usd,estimated_cost_usd,cost_status,completeness";
const row = (changes = {}) => ({ task_id: "task-1", session_id: "parent", agent: "codex", model: "model-1", measurement_source: "codex.response", aggregation_scope: "exclusive", task_description: "Build", input_tokens: "10", output_tokens: "4", cached_input_tokens: "0", cache_write_input_tokens: "0", provider_cost_usd: "", estimated_cost_usd: "0.02", cost_status: "calculated", completeness: "partial", ...changes });

test("CSV quoted commas, quotes, newlines, CRLF and BOM", () => {
  const rows = parseCSV(`\uFEFF${header}\r\nt,s,codex,m,codex.response,exclusive,"quoted, \"\"task\"\"\nline",10,4,0,0,,0.1,calculated,partial\r\n`);
  assert.equal(rows[0].task_description, 'quoted, "task"\nline');
  assert.equal(rows[0].input_tokens, "10");
});

test("empty CSV, header only and invalid input", () => {
  assert.deepEqual(parseCSV(""), []);
  assert.deepEqual(parseCSV(`${header}\n`), []);
  for (const invalid of ["bad,columns\n", `${header}\n"unclosed`, `${header}\n"x"extra`]) assert.throws(() => parseCSV(invalid));
  const records = parseCSV(`${header}\ntoo,few\nt,s,codex,m,codex.response,exclusive,test,NaN,4,0,0,,,unavailable,partial\nt,s,codex,m,codex.response,exclusive,valid,10,4,0,0,,,unavailable,partial`);
  assert.equal(records.length, 1);
  assert.equal(records.invalidRows, 2);
  assert.equal(summarize(records).tasks[0].partial, true);
});

test("exclusive parent plus children aggregate once; inclusive parents excluded", () => {
  const records = [row(), row({ session_id: "child", parent_run_id: "parent", input_tokens: "7" }), row({ session_id: "parent", measurement_source: "codex.exec", input_tokens: "999" }), row({ session_id: "inclusive", aggregation_scope: "inclusive", input_tokens: "999" }), row({ session_id: "unknown", aggregation_scope: "unknown", input_tokens: "999" })];
  const result = summarize(records);
  assert.equal(result.selected.length, 2);
  assert.equal(result.tasks[0].input.value, 17);
  assert.equal(result.tasks[0].excluded, 3);
  assert.equal(result.tasks[0].partial, true);
});

test("source precedence applies to whole session across model switches", () => {
  const records = [row({ model: "model-2" }), row({ measurement_source: "codex.exec", model: "", input_tokens: "999" }), row()];
  assert.equal(selectRows(records).length, 2);
  assert.ok(selectRows(records).every((record) => record.measurement_source === "codex.response"));
});

test("harmless alternate-source dedup does not imply incomplete coverage", () => {
  const records = [row({ completeness: "reported_complete" }), row({ measurement_source: "codex.exec", completeness: "partial" })];
  const task = summarize(records).tasks[0];
  assert.equal(task.excluded, 1);
  assert.equal(task.uncovered, 0);
  assert.equal(task.partial, false);
});

test("latest exact duplicate wins, with no parent traversal or cycle double count", () => {
  const records = [row({ datetime: "2026-11-16T10:00:00Z", input_tokens: "1" }), row({ datetime: "2026-11-16T11:00:00Z", parent_run_id: "parent" })];
  assert.equal(summarize(records).tasks[0].input.value, 10);
});

test("provider charges and estimates stay separate; unknown stays unknown", () => {
  const records = [row({ provider_cost_usd: "1", estimated_cost_usd: "", cost_status: "provider_reported" }), row({ session_id: "child", input_tokens: "", estimated_cost_usd: "2" })];
  const task = summarize(records).tasks[0];
  assert.equal(task.provider.value, 1);
  assert.equal(task.estimate.value, 2);
  assert.equal(task.provider.known, 1);
  assert.equal(task.input.known, 1);
  assert.equal(task.partial, true);
});

test("task text remains literal data, including HTML", () => {
  const malicious = '<img src=x onerror="alert(1)">';
  assert.equal(summarize([row({ task_description: malicious })]).tasks[0].description, malicious);
});

test("total recorded tokens respects provider cache semantics and missing values", () => {
  const result = totalTokens([row({ input_tokens: "10", output_tokens: "4", cached_input_tokens: "8" }), row({ agent: "claude", input_tokens: "2", output_tokens: "3", cached_input_tokens: "8", cache_write_input_tokens: "5" })]);
  assert.equal(result.value, 32);
  assert.equal(result.complete, 2);
  const partial = totalTokens([row({ input_tokens: "10", output_tokens: "" })]);
  assert.equal(partial.value, 10);
  assert.equal(partial.known, 1);
  assert.equal(partial.complete, 0);
});
