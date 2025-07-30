declare namespace Express {
  interface Request {
    _authData: {
      account: { id: string; name: string }
      user: { id: string }
    }
    _externalIP: string
  }
}
