export function mergeAbortSignals(
  signal1: undefined | AbortSignal,
  signal2: undefined | AbortSignal,
): undefined | AbortSignal {
  if (signal1 === undefined) {
    return signal2
  }

  if (signal2 === undefined) {
    return signal1
  }

  if (signal1.aborted === true) {
    return signal1
  }

  if (signal2.aborted === true) {
    return signal2
  }

  const mergedController = new AbortController()

  const listener1 = () => {
    if (mergedController.signal.aborted === false) {
      mergedController.abort()
    }

    signal1.removeEventListener('abort', listener1)
  }

  const listener2 = () => {
    if (mergedController.signal.aborted === false) {
      mergedController.abort()
    }

    signal2.removeEventListener('abort', listener2)
  }

  signal1.addEventListener('abort', listener1)
  signal2.addEventListener('abort', listener2)

  return mergedController.signal
}
