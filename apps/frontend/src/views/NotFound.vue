<script lang="ts" setup></script>

<template>
  <div class="grid h-screen place-content-center bg-white px-4">
    <div class="text-center">
      <h1 class="text-9xl font-black text-gray-200">404</h1>

      <p class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Uh-oh!
      </p>

      <p class="mt-4 text-gray-500" data-test="warn-message">
        Não conseguimos encontrar esta página.
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
