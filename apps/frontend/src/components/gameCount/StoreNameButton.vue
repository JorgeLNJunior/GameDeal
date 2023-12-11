<script lang="ts" setup>
import type { Store } from '@packages/types'
import type { PropType } from 'vue'

import { GREEN_MAN_GAMING_URL, NUUVEM_URL, STEAM_URL } from '@/constants/urls'
import GMGIcon from '@/icons/GMGIcon.vue'
import NuuvemIcon from '@/icons/NuuvemIcon.vue'
import SteamIcon from '@/icons/SteamIcon.vue'

const props = defineProps({
  store: {
    type: String as PropType<Store>,
    required: true
  }
})

const storeName = (): string | undefined => {
  if (props.store === 'Steam') return 'Steam'
  if (props.store === 'Nuuvem') return 'Nuuvem'
  if (props.store === 'Green Man Gaming') return 'Green Man Gaming'
}

const storeURL = (): string | undefined => {
  if (props.store === 'Steam') return STEAM_URL
  if (props.store === 'Nuuvem') return NUUVEM_URL
  if (props.store === 'Green Man Gaming') return GREEN_MAN_GAMING_URL
}
</script>

<template>
  <a
    :href="storeURL() || ''" target="_blank" rel="noopener noreferrer"
    class="group flex flex-row items-center space-x-1 rounded-md border border-slate-400 p-1.5 transition hover:border-transparent hover:bg-cyan-600"
    test-data="button"
  >
      <SteamIcon class="h-3 fill-slate-900 transition group-hover:fill-white" v-if="props.store === 'Steam'" test-data="steam-icon" />
      <NuuvemIcon class="h-3 fill-slate-900 transition group-hover:fill-white" v-if="props.store === 'Nuuvem'" test-data="nuuvem-icon" />
      <GMGIcon class="h-3 fill-slate-900 transition group-hover:fill-white" v-if="props.store === 'Green Man Gaming'" test-data="gmg-icon" />
      <p class="text-xs text-slate-900 transition group-hover:text-white" test-data="name">{{ storeName() }}</p>
  </a>
</template>
