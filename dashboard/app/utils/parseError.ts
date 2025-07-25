export function parseError(err: unknown): string | null {
  if (!err) return null;

  if (err instanceof Error) {
    try {
      const parsed = JSON.parse(err.message);
      return parsed?.message || "Unexpected error occurred";
    } catch {
      return err.message || "Unexpected error occurred";
    }
  }

  return "Unknown error";
}
