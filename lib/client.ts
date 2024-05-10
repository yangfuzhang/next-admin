import { getItem, setItem, removeItem } from './storage'
import { AUTH_TOKEN, AUTH_REFRESH, ADMIN_THEME_CONFIG } from './constants'
import { ThemeConfig } from '@/types';

export function getClientAuthToken() {
  return getItem(AUTH_TOKEN);
}

export function setClientAuthToken(token: string) {
  setItem(AUTH_TOKEN, token);
}

export function removeClientAuthToken() {
  removeItem(AUTH_TOKEN);
}

export function getClientRefreshToken() {
  return getItem(AUTH_REFRESH);
}

export function setClientRefreshToken(refreshToken: string) {
  setItem(AUTH_REFRESH, refreshToken);
}

export function removeClientRefreshToken() {
  removeItem(AUTH_REFRESH);
}

export function getAdminThemeConfig() {
  return getItem(ADMIN_THEME_CONFIG);
}

export function setAdminThemeConfig(config: ThemeConfig) {
  return setItem(ADMIN_THEME_CONFIG, config);
}

export function removeAdminThemeConfig() {
  return removeItem(ADMIN_THEME_CONFIG);
}