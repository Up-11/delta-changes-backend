/**
 * Extracts a string ID from either a string or an object with an id property.
 * This is useful when the frontend may send either an ID or a full object.
 */
export function extractId(
  value: string | { id?: string } | null | undefined,
): string | null {
  if (!value) return null;

  if (typeof value === 'string') {
    return value;
  }

  if (
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'string'
  ) {
    return value.id;
  }

  return null;
}

/**
 * Extracts an array of string IDs from an array that may contain strings or objects.
 */
export function extractIds(
  values: (string | { id?: string } | null | undefined)[] | null | undefined,
): string[] {
  if (!values || !Array.isArray(values)) return [];

  return values
    .map((v) => extractId(v))
    .filter((id): id is string => id !== null);
}
