<script lang="ts" setup>
import PriceHistoryChartSkeletonVue from './PriceHistoryChartSkeleton.vue'
</script>

<template>
  <div class="flex flex-col space-y-10 rounded-md border border-gray-50 p-6 shadow-md md:w-7/12">
    <div class="flex flex-row justify-between">
      <!-- Title -->
      <div class="h-3 w-36 animate-pulse rounded-full bg-gray-300"></div>
      <!-- Current price -->
      <div class="h-3 w-36 animate-pulse rounded-full bg-gray-300"></div>
    </div>
    <!-- Price history chart -->
    <PriceHistoryChartSkeletonVue />
  </div>
</template>
