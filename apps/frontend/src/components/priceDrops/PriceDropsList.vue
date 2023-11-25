<script lang="ts" setup>
import type { GamePriceDrop } from '@packages/types'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

import { ApiService } from '@/api/api.service'
import { redirectWithHttpError } from '@/router/redirectWithHttpError'

import PriceDropsListItem from './PriceDropsListItem.vue'
import PriceDropsListItemSkeleton from './PriceDropsListItemSkeleton.vue'

const router = useRouter()
const drops = ref<GamePriceDrop[]>([])

onBeforeMount(async () => await getPriceDrops())

const getPriceDrops = async (): Promise<void> => {
  try {
    const data = await new ApiService().getTodayPriceDrops()
    drops.value = data.results
  } catch (error) {
    await redirectWithHttpError(router, error)
  }
}
</script>

<template>
  <div class="flex w-full flex-col justify-center space-y-4 divide-y rounded-md border border-t-4 border-gray-50 border-t-cyan-600 p-4 shadow-md">
    <p class="text-center font-medium">Quedas de preço hoje</p>
    <div class="pt-3">
      <ul v-if="drops.length" test-data="items">
        <PriceDropsListItem v-for="drop in drops" :key="drop.id" :drop="drop" />
      </ul>
      <div v-else test-data="list-skeleton">
        <PriceDropsListItemSkeleton v-for="index in 3" :key="index" />
      </div>
    </div>
  </div>
</template>
