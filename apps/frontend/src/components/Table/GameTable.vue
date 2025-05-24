<script setup lang="ts">
import { type ColumnDef,FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const router = useRouter()

interface Game {
  id: string
  title: string,
  prices: Prices
}

interface Prices {
  steam_price: number
  nuuvem_price: number | null
  green_man_gaming_price: number | null
}

const games = ref<Game[]>([
  {
    id: '1',
    title: 'Resident Evil 4',
    prices: { // FIX: needs API implementation
      steam_price: 120.55,
      nuuvem_price: 149.99,
      green_man_gaming_price: null
    }
  },
  {
    id: '2',
    title: 'Hollow Knight',
    prices: {
      steam_price: 12.45,
      nuuvem_price: 10.68,
      green_man_gaming_price: 19.99
    }
  },
  {
    id: '3',
    title: 'Balatro',
    prices: {
      steam_price: 58.88,
      nuuvem_price: null,
      green_man_gaming_price: 15.94
    }
  },
])

const columns: ColumnDef<Game>[] = [
  {
    accessorKey: 'title',
    header: 'Título'
  },
  {
    accessorKey: 'prices',
    header: 'Preço',
    cell: (row) => {
      const prices: number[] = Object.values(row.getValue<Prices>()).
        filter(v => v != null)
      return Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(Math.min(...prices))
    }
  }
]

const table = useVueTable({
  data: games,
  columns: columns,
  getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
  <div class="border rounded-md">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
            style="cursor: pointer"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              @click="router.push(`/game/${row.original.id}`)"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center"
            >
              Sem resultados.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
