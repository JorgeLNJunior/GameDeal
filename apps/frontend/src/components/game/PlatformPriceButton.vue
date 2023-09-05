<script lang="ts" setup>
import { computed, type PropType } from 'vue'

import GMGIcon from '@/icons/GMGIcon.vue'
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
    <div class="flex items-center space-x-2 rounded-lg border border-slate-500 p-2 transition hover:border-transparent hover:bg-cyan-600 hover:fill-white hover:text-white">
      <NuuvemIcon v-if="props.platform === Platform.NUUVEM" test-data="nuuvem-icon" />
      <SteamIcon v-if="props.platform === Platform.STEAM" test-data="steam-icon" />
      <GMGIcon v-if="props.platform === Platform.GREEN_MAN_GAMING" test-data="gmg-icon" />
      <p class="whitespace-nowrap text-xs md:text-sm" test-data="price">{{ priceWithCurrency }}</p>
    </div>
  </a>
</template>
