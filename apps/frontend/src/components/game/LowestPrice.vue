<script lang="ts" setup>
import { Store } from '@packages/types'
import type { PropType } from 'vue'
const props = defineProps({
  store: {
    type: String as PropType<Store>,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="flex flex-col space-y-1 text-center">
    <p class="text-sm font-medium md:text-base">Menor preço:&nbsp;</p>
    <div class="flex flex-row justify-evenly md:justify-center md:space-x-5">
      <p class="flex flex-col text-sm md:flex-row md:text-base" test-data="store">
        <span class="font-medium">Plataforma:&nbsp;</span>
        {{ props.store }}
      </p>
      <p class="flex flex-col text-sm md:flex-row md:text-base" test-data="price">
        <span class="font-medium">Preço:&nbsp;</span>
        {{ props.price }}
      </p>
      <p class="flex flex-col text-sm md:flex-row md:text-base" test-data="date">
        <span class="font-medium">Data:&nbsp;</span>
        {{ props.date }}
      </p>
    </div>
  </div>
</template>
