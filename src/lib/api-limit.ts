import {auth} from "@clerk/nextjs"

import prismadb from "./prismadb"
import { MAX_FREE_COUNTS } from "@/constants"

// userApiLimit
export const increaseApiLimit = async () => {
    const {userId} = auth(); // get userId from clerk
    if(!userId) return; // if userId is undefined, return
    // get userApiLimit
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId: userId
        }
    });
    // if found update count
    if(userApiLimit) {
        await prismadb.userApiLimit.update({
            where: {
                userId: userId
            },
            data: {
                count: userApiLimit.count + 1
            },
        });
        // else create new userApiLimit
    } else {
        // create new userApiLimit
        await prismadb.userApiLimit.create({
            data: {userId: userId, count: 1},
        });
    }
}

// checkApiLimit
export const checkApiLimit = async () => {
    const {userId} = auth(); // get userId from clerk
    if(!userId) return false; // if userId is undefined, return false

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {userId: userId}
    });

    if(!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
        return true; // has credits available
    } else {
        return false; // no credits available
    }
};

// Get API Limit Count
export const getApiLimitCount = async () => {
    const { userId} = auth(); // get userId from clerk
    if(!userId) {return 0;} // if userId is undefined, return 0

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {userId: userId}
    });

    if (!userApiLimit) {
    return 0;
    }

    return userApiLimit.count;
};