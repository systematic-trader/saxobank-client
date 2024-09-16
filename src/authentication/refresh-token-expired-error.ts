export class RefreshTokenExpiredError extends Error {
  constructor(message: string) {
    super(`Refresh token expired: ${message}`)
  }
}
