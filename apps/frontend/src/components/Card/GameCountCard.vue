<script setup lang="ts">
import { Gamepad2 } from 'lucide-vue-next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const props = defineProps({
  gameCount: {
    type: Number,
    required: true
  },
  gamesSinceLastWeek: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-x-0">
      <CardTitle class="text-sm font-medium">
        Jogos
      </CardTitle>
      <Gamepad2 class="text-muted-foreground h-4 w-4" />
    </CardHeader>
    <CardContent>
      <div
        class="text-2xl font-bold"
        data-testid="count"
      >
        {{ props.gameCount }}
      </div>
      <p
        class="text-xs text-muted-foreground"
        data-testid="sinceLastWeek"
      >
        <!-- FIX: needs API endpoint implementation -->
        +{{ props.gamesSinceLastWeek }} desde a última semana
      </p>
    </CardContent>
  </Card>
</template>
