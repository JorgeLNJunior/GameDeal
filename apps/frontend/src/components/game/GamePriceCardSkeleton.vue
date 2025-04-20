<script lang="ts" setup>
import PriceHistoryChartSkeleton from './PriceHistoryChartSkeleton.vue'
</script>

<template>
  <div class="flex w-11/12 flex-col space-y-10 rounded-md border border-gray-50 p-6 shadow-md md:w-4/5 lg:w-3/4">
    <div class="flex w-full flex-col items-center space-y-4">
      <!-- Title -->
      <div class="h-2 w-56 animate-pulse rounded-full bg-gray-300" />
      <!-- Store buttons -->
      <div class="h-2 w-48 animate-pulse rounded-full bg-gray-300" />
      <!-- Current price -->
      <div class="h-2 w-64 animate-pulse rounded-full bg-gray-300" />
    </div>
    <!-- Price history chart -->
    <PriceHistoryChartSkeleton />
  </div>
</template>
