import { ref, onBeforeUnmount } from 'vue'

export function useWakeLock() {
  const isActive = ref(false)
  const isSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator
  let sentinel = null

  async function request() {
    if (!isSupported) return
    try {
      sentinel = await navigator.wakeLock.request('screen')
      isActive.value = true
      sentinel.addEventListener('release', () => {
        isActive.value = false
      })
    } catch (e) {
      isActive.value = false
    }
  }

  async function release() {
    if (sentinel) {
      await sentinel.release()
      sentinel = null
      isActive.value = false
    }
  }

  async function toggle() {
    if (isActive.value) {
      await release()
    } else {
      await request()
    }
  }

  onBeforeUnmount(() => {
    release()
  })

  return { isActive, isSupported, toggle }
}
