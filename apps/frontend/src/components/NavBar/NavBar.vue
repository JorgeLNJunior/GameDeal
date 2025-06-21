<script setup lang="ts">
import { cn } from '@/lib/utils'

import { Input } from '../ui/input'
import NavBarLink from './NavBarLink.vue';
</script>

<template>
  <div class="border-b">
    <div class="flex h-16 items-center px-6">
      <RouterLink to="/">
        <img
          src="/logo.png"
          class="w-8"
        >
      </RouterLink>
      <nav :class="cn('flex mx-6 items-center space-x-4 lg:space-x-6', $attrs.class ?? '')">
        <NavBarLink
          to="/"
          title="Início"
        />
        <NavBarLink
          to="/deals"
          title="Promoções"
        />
      </nav>
      <div class="ml-auto flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Buscar..."
          class="md:w-[100px] lg:w-[300px]"
        />
      </div>
    </div>
  </div>
</template>
