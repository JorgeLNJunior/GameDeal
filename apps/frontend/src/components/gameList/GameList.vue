<script lang="ts" setup>
import type { Game, GamePrice } from '@shared/types'
import { onBeforeMount, reactive } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

import { ApiService } from '@/api/api.service'

import GameListItem from './GameListItem.vue'
import GameSearchInput from './GameSearchInput.vue'
import PaginationButton from './PaginationButton.vue'

const route = useRoute()

// data
let games = reactive<Game[]>([])
let prices = reactive<GamePrice[]>([])
const pages = reactive({
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  current: Number(route.query.page) || 1,
  total: 1
})
const uiState = reactive({ isDataFetched: false, isUpdate: false })

// hooks
onBeforeMount(async () => await getGames())

onBeforeRouteUpdate(async (guard) => {
  const page = Number(guard.query.page)
  if (!Number.isNaN(page) && page !== pages.current) {
    pages.current = page
    uiState.isUpdate = true
    await getGames()
    uiState.isUpdate = false
  }
})

// functions
async function getGames (): Promise<void> {
  uiState.isDataFetched = false
  const api = new ApiService()

  const data = await api.getGames(pages.current)
  games = data.results
  pages.total = data.pages

  const promises: Array<Promise<GamePrice>> = []
  for (const game of games) {
    promises.push(api.getGamePrice(game.id))
  }
  prices = await Promise.all(promises)

  uiState.isDataFetched = true
}

function getGamePrice (gameID: string): string {
  const price = prices.find((v) => v.game_id === gameID)
  if (price?.steam_price == null) return 'Não registrado!'
  if (price?.steam_price != null && price.nuuvem_price != null) {
    return Math.min(price.steam_price, price.nuuvem_price).toString()
  }
  return price.steam_price.toString()
}
</script>

<template>
  <div class="flex w-1/3 flex-col justify-center space-y-4 rounded-md border border-gray-50 p-4 shadow-md">
    <GameSearchInput />
    <div class="flex flex-col justify-center space-y-4">
      <PaginationButton
        v-if="uiState.isDataFetched || uiState.isUpdate"
        :currentPage="pages.current"
        :totalPages="pages.total"
      />
      <ul v-if="uiState.isDataFetched" class="space-y-1">
        <GameListItem
          v-for="game in games"
          :key="game.id"
          :title="game.title"
          :price="getGamePrice(game.id)"
          :id="game.id"
        />
      </ul>
    </div>
  </div>
</template>
