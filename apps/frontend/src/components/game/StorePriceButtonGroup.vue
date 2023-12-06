<script lang="ts" setup>
import { Store, type Game, type GamePrice } from '@packages/types'
import type { PropType } from 'vue'

import StorePriceButton from './StorePriceButton.vue'

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
  <div class="flex flex-row space-x-3 md:space-x-6">
    <StorePriceButton
      :price="props.currentPrice.steam_price.toString()"
      :url="game.steam_url"
      :store="Store.STEAM"
      test-data="steam-button"
    />
    <StorePriceButton
      v-if="props.game.nuuvem_url && props.currentPrice.nuuvem_price"
      :price="props.currentPrice.nuuvem_price.toString()"
      :url="props.game.nuuvem_url"
      :store="Store.NUUVEM"
      test-data="nuuvem-button"
    />
    <StorePriceButton
      v-if="props.game.green_man_gaming_url && props.currentPrice.green_man_gaming_price"
      :price="props.currentPrice.green_man_gaming_price.toString()"
      :url="props.game.green_man_gaming_url"
      :store="Store.GREEN_MAN_GAMING"
      test-data="gmg-button"
    />
  </div>
</template>
