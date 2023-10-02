export interface HTMLParser {
  /**
   * Gets the value from a HTML selector
   *
   * @param html - The HTML as string.
   * @param selector - The selector to search for.
   * @param removeSelectors - A list of selectors to remove.
   *
   * @returns The text value from the given selector.
   */
  getSelectorValue: (
    html: string,
    selector: string,
    removeSelectors?: string[]
  ) => string | undefined
}
