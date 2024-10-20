import { load } from 'jsr:@std/dotenv@0.225.2'

export const Environment: Record<string, string | undefined> = Deno.env.toObject()

const dotenv = await load()

for (const key in dotenv) {
  const value = dotenv[key]

  if (typeof value === 'string') {
    Environment[key] = dotenv[key]
  }
}
