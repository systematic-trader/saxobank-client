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
