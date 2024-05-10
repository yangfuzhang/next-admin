'use client'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks';
import { removeClientAuthToken, removeClientRefreshToken } from '@/lib/client';
import { removeAuthSuccess } from '@/server-actions/auth';
import { AdminRoutesEnum } from '@/types/enums';

export function useLogout() {
  const { setUser } = useUser();
  const router = useRouter()

  const logout = async() => {
    setUser(null)
    removeClientAuthToken()
    removeClientRefreshToken()
    await removeAuthSuccess()
    router.push(AdminRoutesEnum.LOGIN)
  }

  return {
    logout,
  }
}

export default useLogout;