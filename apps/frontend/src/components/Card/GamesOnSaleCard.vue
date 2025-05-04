<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-vue-next';
import { ref } from 'vue';

const props = defineProps({
  salesCount: {
    type: Number,
    required: true
  },
  salesSinceYesterday: {
    type: Number,
    required: true
  }
})

const sign = ref(props.salesSinceYesterday >= 0 ? '+' : '-')
</script>

<!-- FIX: needs API endpoint implementation -->
<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-x-0">
      <CardTitle class="text-sm font-medium">Em Promoção</CardTitle>
      <DollarSign class="text-muted-foreground h-4 w-4" />
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold" data-testid="count">{{ props.salesCount }}</div>
      <p class="text-xs text-muted-foreground" data-testid="sinceYesterday">
        {{ sign }}{{ Math.abs(props.salesSinceYesterday) }} desde ontem
      </p>
    </CardContent>
  </Card>
</template>
