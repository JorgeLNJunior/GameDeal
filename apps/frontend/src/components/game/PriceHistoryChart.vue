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
  PointElement
} from 'chart.js'
import { computed, type PropType } from 'vue'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Legend)

const props = defineProps({
  priceHistory: {
    type: Array as PropType<GamePrice[]>,
    required: true
  }
})

const steamPrices = computed(() => props.priceHistory.map((price) => price.steam_price).reverse())
const labels = computed(() => {
  return props.priceHistory.map(price => {
    const createdAt = new Date(price.created_at)
    return `${createdAt.getUTCDate()}/${createdAt.getUTCMonth() + 1}` // getMonth starts from 0
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
    line: { borderCapStyle: 'round', borderJoinStyle: 'round' }
  },
  plugins: {
    legend: { position: 'top' }
  }
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
</script>

<template>
  <Line id="chart" :data="(chartData as any)" :options="(chartOptions as any)" />
</template>
