<script lang="ts" setup>
import type { Game, GamePrice } from '@shared/types'
import type { PropType } from 'vue'

import { Platform } from '@/types/Platform'

import PlatformPriceCard from './PlatformPriceCard.vue'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true
  },
  currentPrice: {
    type: Object as PropType<GamePrice>,
    required: true
  }
})
</script>

<template>
  <div class="flex flex-row space-x-6">
    <PlatformPriceCard
      :price="props.currentPrice.steam_price.toString()"
      :url="game.steam_url"
      :platform="Platform.STEAM"
    />
    <PlatformPriceCard
      v-if="props.game.nuuvem_url && props.currentPrice.nuuvem_price"
      :price="props.currentPrice.nuuvem_price.toString()"
      :url="props.game.nuuvem_url"
      :platform="Platform.NUUVEM"
    />
  </div>
</template>
