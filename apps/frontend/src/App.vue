<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar/NavBar.vue';
</script>

<template>
  <NavBar />
  <main class="p-6">
    <RouterView />
  </main>
</template>
