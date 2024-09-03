import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts'

export const Environment: Record<string, string | undefined> = Deno.env.toObject()

const dotenv = await load()

for (const key in dotenv) {
  const value = dotenv[key]

  if (typeof value === 'string') {
    Environment[key] = dotenv[key]
  }
}
