// this will check if the subscription has expired
import { auth } from "@clerk/nextjs"
import prismadb from "./prismadb"

const DAY_IN_MS = 86_400_000 // for grace period

export const checkSubscription = async () => {
    const { userId } = auth();

    if(!userId){
        return false;
    }

    // find sub
    const userSubscription = await prismadb.userSubscription.findUnique({
        where: {
            userId: userId
        },
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    });
    // if no active sub return false
    if(!userSubscription){
        return false;
    }

    // if sub is active and not exired - add 24 hours grace period
    const isValid =
    userSubscription.stripePriceId && 
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();
    return !!isValid; // boolean
};
