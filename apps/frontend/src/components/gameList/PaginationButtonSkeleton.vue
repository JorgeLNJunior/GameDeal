<script lang="ts" setup></script>

<template>
  <div class="inline-flex items-center justify-center gap-3">
    <!-- Previous button -->
    <button
      disabled
      class="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 disabled:border-0 disabled:bg-gray-100 rtl:rotate-180"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Loader -->
    <div class="flex animate-pulse items-center">
      <div class="h-3 w-10 rounded-full bg-gray-300"></div>
    </div>

    <!-- Next page button -->
    <button
      disabled
      class="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 disabled:border-0 disabled:bg-gray-100 rtl:rotate-180"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

  </div>
</template>
