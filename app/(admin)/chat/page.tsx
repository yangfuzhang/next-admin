import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { get } from "@/lib/request";
import { PageContent } from "./page-content";

export default async function Page() {
  const queryClient = new QueryClient();

  // 服务端数据Prefetch
  await queryClient.prefetchQuery({
    queryKey: ["bots"],
    queryFn: () => get("/bots"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageContent />
    </HydrationBoundary>
  );
}
