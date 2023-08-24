export class DataFormater {
  /**
   * Formats a given price with the R$ ??,?? format.
   *
   * @example
   * ```
   * const price = formater.formatPriceWithCurrency(150.99) // R$ 150,99
   * ```
   *
   * @param price - The price to format
   */
  formatPriceWithCurrency (price: number): string {
    return `R$ ${String(price).replace('.', ',')}`
  }

  /**
   * Formats a given date with the D/MMMM format.
   *
   * @example
   * ```
   * const date = formater.formatShortDate('2023-01-15') // 15/Jan
   * ```
   *
   * @param date - The date to format.
   */
  formatShortDate (date: Date | string): string {
    const d = new Date(date)
    const weekDay = d.getUTCDate()
    const month = this.numberToMonthName(d.getUTCMonth()).substring(0, 3)
    return `${weekDay}/${month}`
  }

  /**
   * Formats a given date with the D MM de YYYY format.
   *
   * @example
   * ```
   * const date = formater.formatDate('2023-01-15') // 15 Jan de 2018
   * ```
   *
   * @param date - The date to format.
   */
  formatFullDate (date: Date | string): string {
    const d = new Date(date)
    const day = d.getUTCDate()
    const month = this.numberToMonthName(d.getUTCMonth()).substring(0, 3)
    const year = d.getUTCFullYear()

    return `${day} ${month} de ${year}`
  }

  private numberToMonthName (monthNumber: number): Month {
    return months[monthNumber]
  }
}

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
] as const

type Month = typeof months[number]
