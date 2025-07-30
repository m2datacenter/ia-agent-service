export type HttpResponse<T> = {
  statusCode: number
  body: T
}

export interface IController<Request, ResponseBody> {
  handle(httpRequest: Request): Promise<HttpResponse<ResponseBody>>
}
