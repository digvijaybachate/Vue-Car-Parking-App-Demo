import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

export const useAuth = defineStore('auth', () => {
  const router = useRouter()
  const accessToken = useStorage('access_token', '')
  const check = computed(() => !!accessToken.value)

  function setAccessToken(value) {
    accessToken.value = value
    window.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken.value}`
  }

  function login(accessToken) {
    setAccessToken(accessToken)
    router.push({ name: 'vehicles.index' })
  }

  function destroyTokenAndRedirectTo(routeName = 'login') {
    setAccessToken(null)
    router.push({ name: routeName })
  }

  async function logout() {
    return window.axios.post('auth/logout').finally(() => {
      destroyTokenAndRedirectTo()
    })
  }

  return { login, logout, check, destroyTokenAndRedirectTo }
})
