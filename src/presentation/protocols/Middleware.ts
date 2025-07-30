export type HttpRequest = {
  headers: any
  body?: any
  params?: any
  cookies?: any
  _externalIP: string
}

export type HttpResponse = {
  statusCode: number
  body?: any
}

export interface Middleware {
  execute(request: HttpRequest, role: string): Promise<HttpResponse>
}
