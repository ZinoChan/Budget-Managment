export function omit<T extends Record<string, any>>(
  object: T,
  keysToOmit: string[]
): Omit<T, keyof T> {
  const omittedKeysSet = new Set(keysToOmit);
  const result: Partial<T> = {};

  for (const key in object) {
    if (!omittedKeysSet.has(key)) {
      result[key] = object[key];
    }
  }

  return result as Omit<T, keyof T>;
}
