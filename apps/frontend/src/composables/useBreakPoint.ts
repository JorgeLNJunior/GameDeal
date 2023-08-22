import { onMounted, onUnmounted, type Ref, ref } from 'vue'

export function useBreakPoint (): Ref<BreakPoint> {
  const bp: Ref<BreakPoint> = ref('sm')

  function update (): void {
    const width: number = document.documentElement.clientWidth
    if (width <= 640) bp.value = 'sm'
    if (width > 640) bp.value = 'md'
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })
  onUnmounted(() => { window.removeEventListener('resize', update) })

  return bp
}

type BreakPoint = 'sm' | 'md'
