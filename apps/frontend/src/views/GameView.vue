<script lang="ts" setup>
import type { Game, GamePrice } from '@shared/types'
import { computed, onBeforeMount, reactive } from 'vue'
import { useRoute } from 'vue-router'

import { ApiService } from '@/api/api.service'
import LowestPrice from '@/components/game/LowestPrice.vue'
import PlatformPriceCard from '@/components/game/PlatformPriceCard.vue'
import PriceHistoryChart from '@/components/game/PriceHistoryChart.vue'
import { DataFormater } from '@/helpers/DataFormater'
import { Platform } from '@/types/Platform'

const route = useRoute()

// data
let game = reactive<Game>({} as any)
let currentPrice = reactive<GamePrice>({} as any)
let lowestPrice = reactive<GamePrice>({} as any)
let priceHistory = reactive<GamePrice[]>([])
const uiState = reactive({ isDataFetched: false })

// computeds
const formatedLowestPrice = computed(() => {
  const formater = new DataFormater()
  const date = formater.formatDate(lowestPrice.created_at)
  if (lowestPrice.nuuvem_price != null) {
    if (lowestPrice.steam_price < lowestPrice.nuuvem_price) {
      return {
        platform: 'Steam',
        price: formater.formatPriceWithCurrency(lowestPrice.steam_price),
        date
      }
    }
    return {
      platform: 'Nuuvem',
      price: `R$ ${formater.formatPriceWithCurrency(lowestPrice.nuuvem_price)}`,
      date
    }
  }
  return {
    platform: 'Steam',
    price: `R$ ${formater.formatPriceWithCurrency(lowestPrice.steam_price)}`,
    date
  }
})

// hooks
onBeforeMount(async () => {
  uiState.isDataFetched = false
  const promises = [getGame(), getGamePrice(), getLowestPrice(), getGamePriceHistory()]
  await Promise.all(promises)
  uiState.isDataFetched = true
  document.title = `${game.title} | Game Price Tracker`
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
    <div v-if="uiState.isDataFetched" class="flex flex-col space-y-4 rounded-md border border-gray-50 p-6 shadow-md md:w-7/12">
      <div class="flex flex-row justify-between">
        <!-- Title -->
        <p class="select-none text-2xl font-medium">{{ game.title }}</p>
        <!-- Current price -->
        <div class="flex flex-row space-x-6">
          <PlatformPriceCard
            :price="currentPrice.steam_price.toString()"
            :url="game.steam_url"
            :platform="Platform.STEAM"
          />
          <PlatformPriceCard
            v-if="game.nuuvem_url && currentPrice.nuuvem_price"
            :price="currentPrice.nuuvem_price.toString()"
            :url="game.nuuvem_url"
            :platform="Platform.NUUVEM"
          />
        </div>
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
  </div>
</template>
