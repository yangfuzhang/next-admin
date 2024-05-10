import { create } from 'zustand'
import {
  getAdminThemeConfig,
  setAdminThemeConfig,
} from '@/lib/client'
import { ThemeConfig } from '@/types'
import { User } from '@/types/user'

interface InitialStateType  {
  user: User | null,
  adminThemeConfig: ThemeConfig,
}

const initialState: InitialStateType = {
  user: null,
  adminThemeConfig: getAdminThemeConfig() ?? { theme: 'blue', radius: 0.5 },
}

const store = create(() => ({...initialState}))

export function setUser(user: User | null) {
  store.setState({ user })
}

export function setAdminTheme(adminThemeConfig: ThemeConfig) {
  setAdminThemeConfig(adminThemeConfig)
  store.setState({ adminThemeConfig })
}

export default store