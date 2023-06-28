<script lang="ts" setup>
import type { GamePrice } from '@shared/types'
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
import { type PropType } from 'vue'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Legend)

const props = defineProps({
  priceHistory: {
    type: Array as PropType<GamePrice[]>,
    required: true
  }
})

const steamDataset: ChartDataset<'line'> = {
  label: 'Steam',
  data: props.priceHistory.map((price) => price.steam_price).reverse(),
  borderColor: 'rgb(6, 182, 212)',
  backgroundColor: 'rgb(6, 182, 212)'
}

const labels: string[] = props.priceHistory.map((price) => {
  const createdAt = new Date(price.created_at)
  return `${createdAt.getUTCDate()}/${createdAt.getUTCMonth()}`
}).reverse()

const chartData: ChartData = {
  labels,
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
  const nuuvemDataset: ChartDataset<'line'> = {
    label: 'Nuuvem',
    data: props.priceHistory.map((price) => price.nuuvem_price).reverse(),
    borderColor: 'rgb(220, 38, 38)',
    backgroundColor: 'rgb(220, 38, 38)'
  }
  chartData.datasets.push(nuuvemDataset)
}
</script>

<template>
  <Line id="chart" :data="(chartData as any)" :options="(chartOptions as any)" />
</template>
