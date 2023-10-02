import { RedirectToDocsController } from './redirectToDocs.controller'

describe('RedirectToDocsController', () => {
  it('Should redirect to /docs', async () => {
    const controller = new RedirectToDocsController()

    const response = controller.handle()

    expect(response.statusCode).toBe(303)
    expect(response.to).toBe('/docs')
  })
})
