export class DataFormater {
  formatPriceWithCurrency (price: number): string {
    return `R$ ${String(price).replace('.', ',')}`
  }

  formatDate (date: Date | string): string {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })
      .format(new Date(date))
  }
}
