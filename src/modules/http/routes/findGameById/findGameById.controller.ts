import { ResponseBuilder } from '@http/responses/response.builder'
import { BaseController } from '@localtypes/http/baseController.type'
import { HttpRequest, HttpResponse } from '@localtypes/http/http.type'
import { FindGameByIdRepository } from '@modules/shared/repositories/findGameById.repository'
import { injectable } from 'tsyringe'

@injectable()
export class FindGameByIdController implements BaseController {
  public method = 'GET'
  public url = '/games/:id'

  constructor(private repository: FindGameByIdRepository) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const game = await this.repository.find(request.params.id)
    if (!game) return ResponseBuilder.notFound('game not found')

    return ResponseBuilder.ok(game)
  }
}
