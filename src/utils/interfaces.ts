// interface will implement in the different model
export interface IModel<T, U, G> {
  // T: request
  // U: response
  // G: error
  requestOpenAI: (data: T) => Promise<U | Partial<G>>
}
