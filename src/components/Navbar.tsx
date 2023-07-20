// Navbar


import { UserButton } from "@clerk/nextjs"
import MobileSidebar from "./mobile-sidebar"
import { getApiLimitCount } from "@/lib/api-limit";



type Props = {}

const Navbar = async (props: Props) => {
  const apiLimitCount = await getApiLimitCount();

  return (
    <div className="flex items-center p-4">
        <MobileSidebar apiLimitCount={apiLimitCount} />
        {/* User button/icon/menu */}
        <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
        </div>
    </div>
  )
}

export default Navbar