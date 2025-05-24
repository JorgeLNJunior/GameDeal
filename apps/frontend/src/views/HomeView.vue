<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { ApiService } from '@/api/api.service';
import GameCountCard from '@/components/Card/GameCountCard.vue';
import GamesOnSaleCard from '@/components/Card/GamesOnSaleCard.vue';
import GameTable from '@/components/Table/GameTable.vue';

const api = new ApiService()

const gameCount = ref({
  isFetching: false,
  count: 0
})

onBeforeMount(async () => {
  try {
    gameCount.value.isFetching = true
    gameCount.value.count = await api.getGameCount()
  } catch (error) {
    console.error(error)
  } finally {
    gameCount.value.isFetching = false
  }
})
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <GameCountCard
      :game-count="gameCount.count"
      :games-since-last-week="15"
    />
    <GamesOnSaleCard
      :sales-count="32"
      :sales-since-yesterday="12"
    />
    <!-- FIX: find out what data to show on these two cards -->
    <GameCountCard
      :game-count="gameCount.count"
      :games-since-last-week="15"
    />
    <GamesOnSaleCard
      :sales-count="32"
      :sales-since-yesterday="12"
    />
  </div>
  <div class="container py-4">
    <GameTable />
  </div>
</template>
