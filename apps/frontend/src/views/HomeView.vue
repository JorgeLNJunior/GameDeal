<script setup lang="ts">
import GameList from '@/components/gameList/GameList.vue'
import PriceDropsList from '@/components/priceDrops/PriceDropsList.vue'

</script>

<template>
  <main class="my-6 flex flex-col items-center md:mx-20 md:mt-0 md:flex-row md:items-start md:justify-between md:space-x-5">
    <div class="hidden w-11/12 md:block md:w-1/3">
      <PriceDropsList />
    </div>
    <div class="w-11/12 md:w-2/3">
      <GameList />
    </div>
  </main>
</template>
