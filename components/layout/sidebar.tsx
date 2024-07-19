import { Menu } from "./menu";
import Account from "./account";
export async function SideBar() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between">
      <div className="flex flex-col items-center">
        <div className="py-4 text-lg font-medium">诲知留学</div>
        <Menu />
      </div>

      <Account />
    </div>
  );
}
