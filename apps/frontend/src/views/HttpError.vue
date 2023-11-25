<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { HttpErrorType } from '@/types/httpError.type'

const route = useRoute()
const errorType = route.query.error as HttpErrorType

const messages = {
  internalError: 'Ocorreu um erro inesperado.',
  notFound: 'Não conseguimos encontrar esta página.',
  tooManyRequests: 'Parece que você atingiu o limite de requisições. Por favor, aguarde alguns segundos.'
}

const message = ref<string>('Ocorreu um erro desconhecido.')
const status = ref<number>(500)

if (errorType === HttpErrorType.INTERNAL) {
  message.value = messages.internalError
  status.value = 500
}
if (errorType === HttpErrorType.NOT_FOUND) {
  message.value = messages.notFound
  status.value = 404
}
if (errorType === HttpErrorType.TOO_MANY_REQUESTS) {
  message.value = messages.tooManyRequests
  status.value = 429
}
</script>

<template>
  <div class="grid bg-white px-4">
    <div class="pt-20 text-center">
      <h1 class="text-9xl font-black text-gray-200" data-test="status">{{ status }}</h1>

      <p class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Ops!
      </p>

      <p class="mt-4 text-gray-500 sm:whitespace-break-spaces" data-test="warn-message">
        {{ message }}
      </p>

      <RouterLink to="/" data-test="redirect">
        <a
          class="mt-6 inline-block rounded bg-cyan-600 px-5 py-3 text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring"
        >
          Voltar Para o Início
        </a>
      </RouterLink>
    </div>
  </div>

</template>
