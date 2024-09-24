export function urlJoin(base: string | URL, ...paths: ReadonlyArray<undefined | string>): URL {
  let url = new URL(base)

  for (const path of paths) {
    if (path === undefined) {
      continue
    }

    const nextBase = url.href.endsWith('/') ? url.href : `${url.href}/`
    const nextPath = path.startsWith('/') ? path.slice(1) : path

    url = new URL(nextPath, nextBase)
  }

  return url
}

export function extractKeys<T extends object>(object: T): ReadonlyArray<keyof T> {
  return Object.keys(object) as unknown as ReadonlyArray<keyof T>
}

export function extractValues<T extends object>(
  object: {
    readonly [K in keyof T]: T[K]
  },
): ReadonlyArray<T[keyof T]> {
  return Object.values<T[keyof T]>(object)
}

export function extractEntries<T extends Record<keyof never, unknown>>(
  object: {
    readonly [K in keyof T]: T[K]
  },
): ReadonlyArray<{ readonly [K in keyof T]: readonly [K, T[K]] }[keyof T]> {
  return Object.entries(object)
}

export function fromEntries<T extends readonly [keyof never, unknown]>(
  entries: readonly T[],
): { readonly [key in T[0]]: Extract<T, readonly [key, unknown]>[1] } {
  return Object.fromEntries(entries) as { readonly [key in T[0]]: Extract<T, readonly [key, unknown]>[1] }
}
