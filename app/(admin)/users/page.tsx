import { auth } from "@/auth";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { DEFAULT_PAGESIZE } from "@/lib/constants";
import { get } from "@/lib/request";
import { Table } from "./table";
import { RolesEnum } from "@/types/enums";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const role = session?.user.role;

  if (role !== RolesEnum.SUPER && role !== RolesEnum.ADMIN) {
    return redirect("/403");
  }

  const queryClient = new QueryClient();

  // 服务端数据Prefetch
  await queryClient.prefetchQuery({
    queryKey: ["users", 1, DEFAULT_PAGESIZE, {}, []],
    queryFn: () =>
      get("/users", {
        page: 1,
        pageSize: DEFAULT_PAGESIZE,
        filters: {},
        sorting: [],
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-4">
        <Table />
      </div>
    </HydrationBoundary>
  );
}
