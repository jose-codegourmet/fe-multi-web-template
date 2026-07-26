export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch("/api/images", { method: "POST", body });

  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(json.error ?? "Image upload failed");
  }

  const { url } = (await res.json()) as { url: string };
  return url;
}
