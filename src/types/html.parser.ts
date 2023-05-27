export interface HTMLParser {
  getElementValue: (
    content: string,
    element: string,
    removeElements?: string[]
  ) => string | undefined
}
