/**
 * Determines whether a given value is an Iterable.
 * @param value - The value to be checked.
 * @returns A type guard indicating whether the value is an Iterable of type T.
 */
export function isIterable<T>(value: unknown): value is Iterable<T> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- intentional
  return typeof (value as Partial<Iterable<T>>)?.[Symbol.iterator] === 'function'
}
