<script lang="ts" setup>
import type { PropType } from 'vue'

import { GREEN_MAN_GAMING_URL, NUUVEM_URL, STEAM_URL } from '@/constants/urls'
import GMGIcon from '@/icons/GMGIcon.vue'
import NuuvemIcon from '@/icons/NuuvemIcon.vue'
import SteamIcon from '@/icons/SteamIcon.vue'
import { Platform } from '@/types/Platform'

const props = defineProps({
  platform: {
    type: String as PropType<Platform>,
    required: true
  }
})

const platformName = (): string | undefined => {
  if (props.platform === Platform.STEAM) return 'Steam'
  if (props.platform === Platform.NUUVEM) return 'Nuuvem'
  if (props.platform === Platform.GREEN_MAN_GAMING) return 'Green Man Gaming'
}

const platformURL = (): string | undefined => {
  if (props.platform === Platform.STEAM) return STEAM_URL
  if (props.platform === Platform.NUUVEM) return NUUVEM_URL
  if (props.platform === Platform.GREEN_MAN_GAMING) return GREEN_MAN_GAMING_URL
}
</script>

<template>
  <a
    :href="platformURL() || ''" target="_blank" rel="noopener noreferrer"
    class="group flex flex-row items-center space-x-1 rounded-md border border-slate-400 p-1.5 transition hover:border-transparent hover:bg-cyan-600"
    test-data="button"
  >
      <SteamIcon class="h-3 fill-slate-900 transition group-hover:fill-white" v-if="props.platform === Platform.STEAM" test-data="steam-icon" />
      <NuuvemIcon class="h-3 fill-slate-900 transition group-hover:fill-white" v-if="props.platform === Platform.NUUVEM" test-data="nuuvem-icon" />
      <GMGIcon class="h-3 fill-slate-900 transition group-hover:fill-white" v-if="props.platform === Platform.GREEN_MAN_GAMING" test-data="gmg-icon" />
      <p class="text-xs text-slate-900 transition group-hover:text-white" test-data="name">{{ platformName() }}</p>
  </a>
</template>
