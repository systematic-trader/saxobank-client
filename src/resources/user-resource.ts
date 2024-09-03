import type { HTTPClient } from '../http-client.ts'
import { User } from '../types/records/user.ts'

export class UserResource {
  #client: HTTPClient

  constructor(client: HTTPClient) {
    this.#client = client
  }

  async me(): Promise<User> {
    return await this.#client.getJSON('https://gateway.saxobank.com/sim/openapi/port/v1/users/me', {
      guard: User,
    })
  }
}
