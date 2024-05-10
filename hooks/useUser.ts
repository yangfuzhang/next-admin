import useStore, { setUser } from '@/store/app';

export function useUser() {
  const user = useStore(state => state.user);

  return { user, setUser };
}

export default useUser;