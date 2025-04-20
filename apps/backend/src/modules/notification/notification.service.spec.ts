import { type Notifier, type NotifyNewGamesData, type NotifyPriceDropData } from '@localtypes/notifier.type'

import { NotificationService } from './notification.service'

describe('NotificationService', () => {
  let notificationService: NotificationService
  let fakeNotifier: Notifier

  beforeEach(async () => {
    fakeNotifier = new FakeNotifier()
    notificationService = new NotificationService(
      [fakeNotifier],
    )
  })

  describe('notifyPriceDrop', () => {
    it('should call "notifyPriceDrop" method from all notifiers', async () => {
      const data: NotifyPriceDropData = {
        gameTitle: 'game title',
        store: 'Steam',
        currentPrice: 100,
        oldPrice: 120,
        gameUrl: 'game url'
      }

      const fakeNotifierSpy = jest.spyOn(fakeNotifier, 'notifyPriceDrop')

      await notificationService.notifyPriceDrop(data)

      expect(fakeNotifierSpy).toHaveBeenCalled()
      expect(fakeNotifierSpy).toHaveBeenCalledWith(data)
    })
  })

  describe('notifyNewGames', () => {
    it('should call "notifyNewGames" method from all notifiers', async () => {
      const data: NotifyNewGamesData = {
        count: 30
      }

      const fakeNotifierSpy = jest.spyOn(fakeNotifier, 'notifyNewGames')

      await notificationService.notifyNewGames(data)

      expect(fakeNotifierSpy).toHaveBeenCalled()
      expect(fakeNotifierSpy).toHaveBeenCalledWith(data)
    })
  })
})

class FakeNotifier implements Notifier {
  async notifyPriceDrop(): Promise<void> { return undefined }
  async notifyNewGames(): Promise<void> { return undefined }
  async start(): Promise<void> { return undefined }
  async stop(): Promise<void> { return undefined }
}
