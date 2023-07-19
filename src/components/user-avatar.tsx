// user avatar component

import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = () => {
    const { user } = useUser(); // get user from clerk

    return (
        // avatar from shadcn
        <Avatar className="h-8 w-8" >
            {/* Avatar */}
            <AvatarImage src={user?.profileImageUrl} />
            {/* Fallback is first letter of first and last name if it exists */}
            <AvatarFallback >
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
            </AvatarFallback>
        </Avatar>
    )
}