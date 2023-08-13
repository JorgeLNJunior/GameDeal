export interface HTMLParser {
  /**
   * Gets the value from a HTML selector
   *
   * @param html - The HTML as string.
   * @param selector - The selector to find for.
   * @param removeSelectors - A list of selector to remove.
   *
   * @returns The text value from the selector.
   */
  getSelectorValue: (
    html: string,
    selector: string,
    removeSelectors?: string[]
  ) => string | undefined
}
