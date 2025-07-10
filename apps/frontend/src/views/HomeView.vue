<script setup lang="ts">
import type {Game, QueryData} from '@packages/types'
import { onBeforeMount, ref } from 'vue';

import { ApiService } from '@/api/api.service';
import GameCountCard from '@/components/Card/GameCountCard.vue';
import GamesOnSaleCard from '@/components/Card/GamesOnSaleCard.vue';
import GameTable from '@/components/Table/GameTable.vue';

const api = new ApiService()

const data = ref({
  isFetching: false,
  games: {} as QueryData<Game[]>,
  gameCount: 0,
  todaySales: 0
})

onBeforeMount(async () => {
  try {
    data.value.isFetching = true
    data.value.gameCount= await api.getGameCount()
    data.value.games = await api.getGames()
    data.value.todaySales = (await api.getTodayPriceDrops(1)).count
  } catch (error) {
    console.error(error)
  } finally {
    data.value.isFetching = false
  }
})
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <GameCountCard
      :game-count="data.gameCount"
      :games-since-last-week="15"
    />
    <GamesOnSaleCard
      :sales-count="data.todaySales"
      :sales-since-yesterday="12"
    />
  </div>
  <div class="py-4">
    <GameTable
      v-if="!data.isFetching"
      :games="data.games"
    />
  </div>
</template>
