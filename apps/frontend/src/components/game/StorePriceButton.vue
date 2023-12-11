<script lang="ts" setup>
import { type Store } from '@packages/types'
import { computed, type PropType } from 'vue'

import GMGIcon from '@/icons/GMGIcon.vue'
import NuuvemIcon from '@/icons/NuuvemIcon.vue'
import SteamIcon from '@/icons/SteamIcon.vue'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  store: {
    type: String as PropType<Store>,
    required: true
  }
})

const priceWithCurrency = computed(() => `R$ ${props.price.replace('.', ',')}`)
</script>

<template>
  <a :href="props.url" target="_blank" rel="noopener noreferrer">
    <div class="flex items-center space-x-2 rounded-lg border border-slate-500 p-2 transition hover:border-transparent hover:bg-cyan-600 hover:fill-white hover:text-white">
      <NuuvemIcon v-if="props.store === 'Nuuvem'" test-data="nuuvem-icon" />
      <SteamIcon v-if="props.store === 'Steam'" test-data="steam-icon" />
      <GMGIcon v-if="props.store === 'Green Man Gaming'" test-data="gmg-icon" />
      <p class="whitespace-nowrap text-xs md:text-sm" test-data="price">{{ priceWithCurrency }}</p>
    </div>
  </a>
</template>
