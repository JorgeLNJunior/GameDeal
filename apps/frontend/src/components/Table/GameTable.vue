<script setup lang="ts">
import type { Game, GamePrice,QueryData } from '@packages/types';
import { type ColumnDef, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table';
import { type PropType} from 'vue'
import { useRouter } from 'vue-router';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const router = useRouter()

const props = defineProps({
  games: {
  required: true,
  type: Object as PropType<QueryData<Game[]>>
  }
})

const columns: ColumnDef<Game>[] = [
  {
    accessorKey: 'title',
    header: 'Título'
  },
  {
    accessorKey: 'prices',
    header: 'Preço',
    cell: (row) => {
      const rowValue = row.getValue<GamePrice>()
      const prices: number[] = [rowValue.steam_price, rowValue.nuuvem_price, rowValue.green_man_gaming_price].
        filter(v => v != null)
      return Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(Math.min(...prices))
    }
  }
]

const table = useVueTable({
  data: props.games.results,
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
