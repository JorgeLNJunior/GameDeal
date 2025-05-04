<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute()
const props = defineProps({
  to: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <RouterLink :to="props.to" class="text-sm font-medium transition-colors hover:text-primary"
    :class="{ 'text-muted-foreground': route.path !== props.to }" data-testid="title">
    {{ props.title }}
  </RouterLink>
</template>
