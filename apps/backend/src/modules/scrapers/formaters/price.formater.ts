export class PriceFormater {
  removeCurrency (str: string): string {
    return str
      .replace('.', '')
      .replace(',', '.')
      .replace('R$', '')
  }
}
