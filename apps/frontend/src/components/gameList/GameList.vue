<script lang="ts" setup>
import type { Game } from '@packages/types'
import { onBeforeMount, reactive } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

import { ApiService } from '@/api/api.service'
import { redirectWithHttpError } from '@/router/redirectWithHttpError'

import GameListItem from './GameListItem.vue'
import GameListItemSkeleton from './GameListItemSkeleton.vue'
import GameSearchInput from './GameSearchInput.vue'
import PaginationButton from './PaginationButton.vue'
import PaginationButtonSkeleton from './PaginationButtonSkeleton.vue'

const route = useRoute()
const router = useRouter()

// data
let games = reactive<Game[]>([])
const pages = reactive({
   
  current: Number(route.query.page) || 1,
  total: 1
})
const uiState = reactive({ isDataFetched: false, isUpdating: false })

// hooks
onBeforeMount(async () => await getGames())

onBeforeRouteUpdate(async (guard) => {
  const page = Number(guard.query.page)
  if (!Number.isNaN(page) && page !== pages.current) {
    pages.current = page
    uiState.isUpdating = true
    await getGames()
    uiState.isUpdating = false
  }
})

// functions
async function getGames (title?: string, page?: number): Promise<void> {
  try {
    uiState.isDataFetched = false
    const api = new ApiService()

    const routeTitle = route.query.title
    if (routeTitle != null) title = routeTitle as string

    const data = await api.getGames(title, page ?? pages.current)
    games = data.results
    pages.total = data.totalPages
    pages.current = data.page

    uiState.isDataFetched = true
  } catch (error) {
    await redirectWithHttpError(router, error)
  }
}
</script>

<template>
  <div class="flex w-full flex-col justify-center space-y-6 divide-y rounded-md border border-t-4 border-gray-50 border-t-cyan-600 p-4 shadow-md">
    <!-- Search -->
    <GameSearchInput @search="getGames" />

    <div class="flex flex-col justify-center space-y-4 pt-4">
      <!-- List -->
      <ul
        v-if="uiState.isDataFetched"
        class="space-y-1"
        test-data="game-list"
      >
        <GameListItem
          v-for="game in games"
          :id="game.id"
          :key="game.id"
          :title="game.title"
        />
      </ul>
      <ul
        v-else
        class="space-y-1"
        test-data="list-skeleton"
      >
        <GameListItemSkeleton
          v-for="index in 3"
          :key="index"
        />
      </ul>

      <!-- Pagination -->
      <PaginationButton
        v-if="uiState.isDataFetched || uiState.isUpdating"
        :current-page="pages.current"
        :total-pages="pages.total"
        test-data="pagination-button"
      />
      <PaginationButtonSkeleton
        v-else
        test-data="pagination-skeleton"
      />
    </div>
  </div>
</template>
