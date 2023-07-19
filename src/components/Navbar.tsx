// Navbar


import { UserButton } from "@clerk/nextjs"
import MobileSidebar from "./mobile-sidebar"



type Props = {}

const Navbar = (props: Props) => {
  return (
    <div className="flex items-center p-4">
        <MobileSidebar />
        {/* User button/icon/menu */}
        <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
        </div>
    </div>
  )
}

export default Navbar