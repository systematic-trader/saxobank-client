export class AccessTokenExpiredError extends Error {
  constructor(message: string) {
    super(`Access token expired: ${message}`)
  }
}
