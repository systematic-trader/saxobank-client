export { expect } from 'jsr:@std/expect'
export { describe, test } from 'jsr:@std/testing/bdd'

import { Timeout } from './timeout.ts'

Timeout.unref = false
