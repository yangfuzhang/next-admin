import * as reactQuery from '@tanstack/react-query';
import { get, post, patch, del } from '@/lib/request'

export function useApi() {
  return { get, post, patch, del, ...reactQuery };
}

export default useApi;