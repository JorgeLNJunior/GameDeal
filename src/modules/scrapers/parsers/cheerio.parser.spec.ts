import { CheerioParser } from './cheerio.parser'

describe('CheerioParser', () => {
  const parser = new CheerioParser()

  it('should return undefined if an element was not found', async () => {
    const elementClass = 'div-content'
    const elementValue = 'this is a div'
    const content = `<div class="${elementClass}">${elementValue}</div>`

    const value = parser.getElementValue(content, '.invalid-class')

    expect(value).toBeUndefined()
  })

  it('should return a value from an element', async () => {
    const elementClass = 'div-content'
    const elementValue = 'this is a div'
    const content = `<div class="${elementClass}">${elementValue}</div>`

    const value = parser.getElementValue(content, `.${elementClass}`)

    expect(value).toBe(elementValue)
  })

  it('should remove all given elements', async () => {
    const elementClass = 'div-content'
    const elementValue = 'this is a div'
    const elementClassToRemove = 'remove-it'
    const content = `
        <div class="${elementClass}">
            <p class=${elementClassToRemove}>Remove it</p>
            ${elementValue}
        </div>
        
    `

    const value = parser.getElementValue(content, `.${elementClass}`, [
      `.${elementClassToRemove}`
    ])

    expect(value).toBe(elementValue)
  })
})
