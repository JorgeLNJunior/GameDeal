<script lang="ts" setup>
import { TELEGRAM_CHANNEL_URL } from '@/constants/urls'
import TelegramIcon from '@/icons/TelegramIcon.vue'
</script>

<template>
  <header aria-label="Site Header" class="bg-white">
  <div
    class="flex h-16 items-center gap-8 px-4 sm:px-6 lg:px-7"
  >
    <RouterLink class="block" to="/">
      <img src="/logo.png" class="w-8 md:w-9">
    </RouterLink>

    <div class="flex flex-1 items-center justify-end">
      <div class="flex items-center gap-4">
        <div class="sm:flex sm:gap-4">
          <a
            class="flex flex-row items-center gap-2 rounded-md bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-cyan-700"
            :href="TELEGRAM_CHANNEL_URL" target="_blank"
            test-data="telegram_channel_btn"
          >
            <TelegramIcon class="h-4"/>
            <span class="hidden sm:block">Telegram</span>
        </a>
        </div>
      </div>
    </div>
  </div>
  </header>
</template>
