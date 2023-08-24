<script lang="ts" setup>
import type { GamePrice } from '@packages/types'
import {
  CategoryScale,
  Chart as ChartJS,
  type ChartData,
  type ChartDataset,
  type ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js'
import { computed, type PropType, ref, watch } from 'vue'
import { Line } from 'vue-chartjs'

import { useBreakPoint } from '@/composables/useBreakPoint'
import { DataFormater } from '@/helpers/DataFormater'

const breakPoint = useBreakPoint()
const chartKey = ref(1) // used to force the chart to re-render

watch(breakPoint, async (newBP, oldBP) => {
  if (newBP !== oldBP) { // change the axis and re-render the chart
    chartOptions.indexAxis = newBP === 'sm' ? 'y' : 'x'
    chartKey.value = ++chartKey.value
  }
})

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Legend, Tooltip)

const props = defineProps({
  priceHistory: {
    type: Array as PropType<GamePrice[]>,
    required: true
  }
})

const steamPrices = computed(() => props.priceHistory.map((price) => price.steam_price).reverse())
const labels = computed(() => {
  const formater = new DataFormater()
  return props.priceHistory.map(price => {
    const createdAt = new Date(price.created_at)
    return formater.formatShortDate(createdAt)
  }).reverse()
})

const steamDataset: ChartDataset<'line'> = {
  label: 'Steam',
  data: steamPrices.value,
  borderColor: 'rgb(6, 182, 212)',
  backgroundColor: 'rgb(6, 182, 212)'
}

const chartData: ChartData = {
  labels: labels.value,
  datasets: [steamDataset]
}
const chartOptions: ChartOptions = {
  elements: {
    line: { borderCapStyle: 'round', borderJoinStyle: 'round', tension: 0.1 }
  },
  plugins: {
    legend: { position: 'top' }
  },
  maintainAspectRatio: false,
  indexAxis: breakPoint.value === 'sm' ? 'y' : 'x'
}

if (props.priceHistory[0].nuuvem_price != null) {
  const nuuvemPrices = computed(() => props.priceHistory.map((price) => price.nuuvem_price).reverse())
  const nuuvemDataset: ChartDataset<'line'> = {
    label: 'Nuuvem',
    data: nuuvemPrices.value,
    borderColor: 'rgb(220, 38, 38)',
    backgroundColor: 'rgb(220, 38, 38)'
  }
  chartData.datasets.push(nuuvemDataset)
}
if (props.priceHistory[0].green_man_gaming_price != null) {
  const gmgPrices = computed(() => props.priceHistory.map((price) => price.green_man_gaming_price).reverse())
  const gmgDataset: ChartDataset<'line'> = {
    label: 'Green Man Gaming',
    data: gmgPrices.value,
    borderColor: 'rgb(22, 163, 74)',
    backgroundColor: 'rgb(22, 163, 74)'
  }
  chartData.datasets.push(gmgDataset)
}
</script>

<template>
  <div class="h-120 w-full md:h-64">
    <Line :key="chartKey" id="chart" :data="(chartData as any)" :options="(chartOptions as any)" />
  </div>
</template>
