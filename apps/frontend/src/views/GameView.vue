<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import type { Game, GamePrice, LowestPrice as ILowestPrice } from '@packages/types'
import { AxiosError } from 'axios'
import { computed, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ApiService } from '@/api/api.service'
import GamePriceCardSkeleton from '@/components/game/GamePriceCardSkeleton.vue'
import LowestPrice from '@/components/game/LowestPrice.vue'
import PlatformPriceButtonGroup from '@/components/game/PlatformPriceButtonGroup.vue'
import PriceHistoryChart from '@/components/game/PriceHistoryChart.vue'
import { DataFormater } from '@/helpers/DataFormater'

const route = useRoute()
const router = useRouter()

// data
let game = reactive<Game>({} as any)
let currentPrice = reactive<GamePrice>({} as any)
let lowestPrice = reactive<ILowestPrice>({} as any)
let priceHistory = reactive<GamePrice[]>([])
const uiState = reactive({ isDataFetched: false })

// computeds
const formatedLowestPrice = computed(() => {
  const formater = new DataFormater()

  const prices = [
    lowestPrice.steam.price,
    lowestPrice.nuuvem.price,
    lowestPrice.green_man_gaming.price
  ].filter((v) => v != null)
  const min = Math.min(...prices as number[])

  if (Number(lowestPrice.steam.price) === min) {
    return {
      platform: 'Steam',
      price: formater.formatPriceWithCurrency(lowestPrice.steam.price as number),
      date: formater.formatFullDate(String(lowestPrice.steam.date))
    }
  }
  if (Number(lowestPrice.nuuvem.price) === min) {
    return {
      platform: 'Nuuvem',
      price: formater.formatPriceWithCurrency(lowestPrice.nuuvem.price as number),
      date: formater.formatFullDate(String(lowestPrice.nuuvem.date))
    }
  }
  if (Number(lowestPrice.green_man_gaming.price) === min) {
    return {
      platform: 'Green Man Gaming',
      price: formater.formatPriceWithCurrency(lowestPrice.green_man_gaming.price as number),
      date: formater.formatFullDate(String(lowestPrice.green_man_gaming.date))
    }
  }

  return {
    platform: 'Sem registro',
    price: 'R$ 0.00',
    date: formater.formatFullDate(new Date())
  }
})

// hooks
onBeforeMount(async () => {
  try {
    uiState.isDataFetched = false
    const promises = [getGame(), getGamePrice(), getLowestPrice(), getGamePriceHistory()]
    await Promise.all(promises)
    uiState.isDataFetched = true
    document.title = `${game.title} | Game Deal`
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      await router.push({ name: 'notFound' })
      return
    }
    await router.push('/error')
  }
})

// functions
async function getGame (): Promise<void> {
  game = await new ApiService().getGameByID(route.params.id as string)
}
async function getGamePrice (): Promise<void> {
  currentPrice = await new ApiService().getGamePrice(route.params.id as string)
}
async function getLowestPrice (): Promise<void> {
  lowestPrice = await new ApiService().getLowestPrice(route.params.id as string)
}
async function getGamePriceHistory (): Promise<void> {
  const { results } = await new ApiService().getGamePriceHistory(route.params.id as string)
  priceHistory = results
}
</script>

<template>
  <div class="my-6 flex justify-center">
    <div
      v-if="uiState.isDataFetched"
      class="flex w-11/12 flex-col space-y-5 rounded-md border border-t-4 border-gray-50 border-t-cyan-600 p-6 shadow-md md:w-4/5 lg:w-3/4"
    >
      <div class="flex flex-col items-center space-y-5 text-center">
        <!-- Title -->
        <p class="text-2xl font-medium" test-data="game-title">{{ game.title }}</p>
        <!-- Current price -->
        <PlatformPriceButtonGroup :game="game" :current-price="currentPrice" />
      </div>

      <!-- Lowest price -->
      <LowestPrice
        :platform="formatedLowestPrice.platform"
        :price="formatedLowestPrice.price"
        :date="formatedLowestPrice.date"
      />

      <!-- Price history chart -->
      <PriceHistoryChart :price-history="priceHistory" />
    </div>
    <GamePriceCardSkeleton v-else test-data="price-skeleton" />
  </div>
</template>
