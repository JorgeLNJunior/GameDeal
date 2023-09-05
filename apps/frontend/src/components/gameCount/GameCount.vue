<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

import { ApiService } from '@/api/api.service'
import { Platform } from '@/types/Platform'

import GameCountSkeleton from './GameCountSkeleton.vue'
import PlatformNameButton from './PlatformNameButton.vue'

const router = useRouter()
const totalGames = ref<number>(0)

onBeforeMount(async () => await getGames())

const getGames = async (): Promise<void> => {
  try {
    const data = await new ApiService().getGames()
    totalGames.value = data.count
  } catch (error) {
    await router.push('/error')
  }
}
</script>

<template>
  <div class="flex w-full flex-col justify-center gap-2 rounded-md border border-t-4 border-gray-50 border-t-cyan-600 p-4 text-center shadow-md">
    <div class="flex flex-col justify-center text-center">
      <span class="text-xl font-medium">Jogos cadastrados</span>
      <span v-if="totalGames" class="text-lg font-normal">{{ totalGames }}</span>
      <GameCountSkeleton v-else />
    </div>
    <div class="space-y-2 p-2">
      <p class="font-medium">Plataformas</p>
      <div class="flex flex-wrap justify-evenly gap-1">
        <PlatformNameButton :platform="Platform.STEAM" />
        <PlatformNameButton :platform="Platform.NUUVEM" />
        <PlatformNameButton :platform="Platform.GREEN_MAN_GAMING" />
      </div>
    </div>
  </div>
</template>
