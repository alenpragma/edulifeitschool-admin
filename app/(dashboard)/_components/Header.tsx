import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import Image from "next/image";
import { User } from "@/types/user";

type Props = {
  setSidebarOpen: (open: boolean) => void;
};

export default function Header({ setSidebarOpen }: Props) {
  const { data: user } = useQuery<User>({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then((res) => res.data.data),
  });

  return (
    <header className="flex items-center h-18 shadow-sm bg-white px-2 fixed left-0 lg:left-72 right-0 top-0 z-30">
      <div className="flex items-center justify-between gap-3 me-auto w-full">
        <div className="flex gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 cursor-pointer"
          >
            <Menu size={24} />
          </button>
          {/* <SearchPopover /> */}
        </div>

        <div className="flex items-center gap-3 ms-auto me-2">
          <div className="text-right leading-tight hidden lg:block">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <Image
            src="/default-avatar.svg"
            alt="Profile"
            width={42}
            height={42}
            className="rounded-full border"
          />
        </div>
      </div>
    </header>
  );
}
