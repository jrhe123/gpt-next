// interface will implement in the different model
export interface IModel<T, U, G> {
  // T: request
  // U: response
  // G: error
  // regular api json response
  requestOpenAI: (data: T) => Promise<U | Partial<G>>

  // use stream
  requestOpenAIStream: (
    data: T
  ) => Promise<ReadableStream<any> | null | undefined>
}
