<script lang="ts" setup>
import type { GamePriceDrop } from '@packages/types'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

import { ApiService } from '@/api/api.service'

import PriceDropsListItem from './PriceDropsListItem.vue'

const router = useRouter()
const drops = ref<GamePriceDrop[]>([])

onBeforeMount(async () => await getPriceDrops())

const getPriceDrops = async (): Promise<void> => {
  try {
    const data = await new ApiService().getTodayPriceDrops()
    drops.value = data.results
    console.log(drops)
  } catch (error) {
    await router.push('/error')
  }
}
</script>

<template>
  <div v-if="drops.length" class="flex w-full flex-col justify-center space-y-4 rounded-md border border-gray-50 p-4 shadow-md">
    <p class="text-center font-medium">Quedas de preços hoje:</p>
    <ul>
      <PriceDropsListItem v-for="drop in drops" :key="drop.id" :drop="drop" />
    </ul>
  </div>
</template>
