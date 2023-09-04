<script lang="ts" setup>
import type { PropType } from 'vue'

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
  if (props.platform === Platform.STEAM) return 'https://store.steampowered.com'
  if (props.platform === Platform.NUUVEM) return 'https://nuuvem.com'
  if (props.platform === Platform.GREEN_MAN_GAMING) return 'https://greenmangaming.com'
}
</script>

<template>
  <a
    :href="platformURL() || ''" target="_blank" rel="noopener noreferrer"
    class="flex flex-row items-center space-x-1 rounded-md p-1.5 shadow-md hover:bg-gray-100">
      <SteamIcon class="h-3" v-if="props.platform === Platform.STEAM" test-data="steam-icon" />
      <NuuvemIcon class="h-3" v-if="props.platform === Platform.NUUVEM" test-data="nuuvem-icon" />
      <GMGIcon class="h-3" v-if="props.platform === Platform.GREEN_MAN_GAMING" test-data="gmg-icon" />
      <p class="text-xs">{{ platformName() }}</p>
  </a>
</template>
