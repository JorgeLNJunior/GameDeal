<script lang="ts" setup>
import { computed, type PropType } from 'vue'

import NuuvemIcon from '@/icons/NuuvemIcon.vue'
import SteamIcon from '@/icons/SteamIcon.vue'
import { Platform } from '@/types/Platform'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  platform: {
    type: String as PropType<Platform>,
    required: true
  }
})

const priceWithCurrency = computed(() => `R$ ${props.price.replace('.', ',')}`)
</script>

<template>
  <a :href="props.url" target="_blank" rel="noopener noreferrer">
    <div class="flex items-center space-x-2 rounded-md border-t-4 border-cyan-600 p-2 shadow-md hover:bg-gray-100">
      <NuuvemIcon v-if="props.platform === Platform.NUUVEM" />
      <SteamIcon v-if="props.platform === Platform.STEAM" />
      <p class="text-sm">{{ priceWithCurrency }}</p>
    </div>
  </a>
</template>
