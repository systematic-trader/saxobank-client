import { authorize } from './authentication/authorize.ts'

const authentication = await authorize()

// todo refactor this into an actual cli?
// deno-lint-ignore no-console
console.log(authentication)
