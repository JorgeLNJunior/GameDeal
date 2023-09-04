<script lang="ts" setup>
import type { Game } from '@packages/types'
import { AxiosError } from 'axios'
import { onBeforeMount, reactive } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

import { ApiService } from '@/api/api.service'

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
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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
    if (error instanceof AxiosError && error.response?.status === 404) {
      await router.push({ name: 'notFound' })
      return
    }
    await router.push('/error')
  }
}
</script>

<template>
  <div class="flex w-full flex-col justify-center space-y-4 rounded-md border border-gray-50 p-4 shadow-md">
    <!-- Search -->
    <GameSearchInput @search="getGames" />

    <div class="flex flex-col justify-center space-y-4">
      <!-- List -->
      <ul v-if="uiState.isDataFetched" class="space-y-1">
        <GameListItem
          v-for="game in games"
          :key="game.id"
          :title="game.title"
          :id="game.id"
        />
      </ul>
      <ul class="space-y-1" v-else>
        <GameListItemSkeleton v-for="index in 3" :key="index" />
      </ul>

      <!-- Pagination -->
      <PaginationButton
        v-if="uiState.isDataFetched || uiState.isUpdating"
        :currentPage="pages.current"
        :totalPages="pages.total"
      />
      <PaginationButtonSkeleton v-else />
    </div>
  </div>
</template>
