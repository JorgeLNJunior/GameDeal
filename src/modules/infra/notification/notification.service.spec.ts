import { PinoLogger } from '@infra/pino.logger'
import type { Notifier, NotifyData } from '@localtypes/notifier.type'

import { NotificationService } from './notification.service'

describe('NotificationService', () => {
  let notificationService: NotificationService
  let fakeNotifier: Notifier

  beforeEach(async () => {
    fakeNotifier = new FakeNotifier()
    notificationService = new NotificationService(
      [fakeNotifier],
      new PinoLogger()
    )
  })

  describe('notify', () => {
    it('should call the "notify" method from all notifiers', async () => {
      const data: NotifyData = {
        gameTitle: 'game title',
        platform: 'Steam',
        currentPrice: 100,
        oldPrice: 120,
        gameUrl: 'game url'
      }

      const fakeNotifierSpy = jest.spyOn(fakeNotifier, 'notify')

      await notificationService.notify(data)

      expect(fakeNotifierSpy).toHaveBeenCalled()
      expect(fakeNotifierSpy).toHaveBeenCalledWith(data)
    })
  })

  describe('start', () => {
    it('should call the "start" method from all notifiers', async () => {
      const fakeNotifierSpy = jest.spyOn(fakeNotifier, 'start')

      await notificationService.start()

      expect(fakeNotifierSpy).toHaveBeenCalled()
    })
  })

  describe('stop', () => {
    it('should call the "stop" method from all notifiers', async () => {
      const fakeNotifierSpy = jest.spyOn(fakeNotifier, 'stop')

      await notificationService.stop()

      expect(fakeNotifierSpy).toHaveBeenCalled()
    })
  })
})

class FakeNotifier implements Notifier {
  async notify (): Promise<void> {
    console.log('')
  }

  async start (): Promise<void> {
    console.log('')
  }

  async stop (): Promise<void> {
    console.log('')
  }
}
