export { expect } from 'std/expect/mod.ts'
export { afterAll, beforeEach, describe, test } from 'std/testing/bdd.ts'

import { Timeout } from './utils.ts'

Timeout.unref = false
