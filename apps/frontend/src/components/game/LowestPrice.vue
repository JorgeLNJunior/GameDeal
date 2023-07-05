<script lang="ts" setup>
const props = defineProps({
  platform: {
    type: String,
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
  <p class="text-center font-medium">Menor preço:</p>
  <div class="flex justify-center space-x-3">
    <p test-data="platform">
      <span class="font-medium">Plataforma:</span>
      {{ props.platform }}
    </p>
    <p test-data="price">
      <span class="font-medium">Preço:</span>
      {{ props.price }}
    </p>
    <p test-data="date">
      <span class="font-medium">Data:</span>
      {{ props.date }}
    </p>
  </div>
</template>
