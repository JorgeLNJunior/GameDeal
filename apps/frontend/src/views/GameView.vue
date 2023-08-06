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
  if (
    (lowestPrice.steam?.steam_price != null && lowestPrice.nuuvem?.nuuvem_price != null) &&
    (lowestPrice.nuuvem?.nuuvem_price < lowestPrice.steam?.steam_price)) {
    return {
      platform: 'Nuuvem',
      price: formater.formatPriceWithCurrency(lowestPrice.nuuvem?.nuuvem_price),
      date: formater.formatDate(String(lowestPrice.nuuvem?.created_at))
    }
  }
  if (lowestPrice.steam != null) {
    return {
      platform: 'Steam',
      price: formater.formatPriceWithCurrency(lowestPrice.steam?.steam_price),
      date: formater.formatDate(String(lowestPrice.steam?.created_at))
    }
  }
  return {
    platform: 'Sem registro',
    price: 'R$ 0.00',
    date: formater.formatDate(new Date())
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
  <div class="flex justify-center">
    <div
      v-if="uiState.isDataFetched"
      class="flex flex-col space-y-4 rounded-md border border-gray-50 p-6 shadow-md md:w-7/12"
    >
      <div class="flex flex-row justify-between">
        <!-- Title -->
        <p class="select-none text-2xl font-medium">{{ game.title }}</p>
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
    <GamePriceCardSkeleton v-else />
  </div>
</template>
