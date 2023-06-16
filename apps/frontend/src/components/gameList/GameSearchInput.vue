<script lang="ts" setup></script>

<template>
  <label class="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-cyan-600">
    <input
      type="email"
      id="UserEmail"
      placeholder="Email"
      class="peer h-8 w-full border-none bg-transparent p-0 placeholder:text-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
    />

    <span
      class="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
    >
      Titulo
    </span>
  </label>
</template>
