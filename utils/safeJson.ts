export async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
