// Free Counter
"use client"

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModel } from "@/hooks/use-pro-modal";

interface FreeCounterProps {
    apiLimitCount: number;
};

export const FreeCounter = ({apiLimitCount=0}:FreeCounterProps) => {
    const proModal = useProModel();
    // Trick for hydration errors
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if(!mounted){return null};
    // End of trick


    return (
        <div className="px-3">
            <Card className="bg-white/10 border-0">
            <CardContent className="py-6">
                <div className="text-center text-sm text-white mb-4 space-y-2">
                    <p>{apiLimitCount} / {MAX_FREE_COUNTS} Free Generations</p>
                    <Progress 
                    value={apiLimitCount / MAX_FREE_COUNTS * 100}
                    className="h-3"
                    />
                </div>
                {/* Button */}
                <Button className="w-full" variant="premium" onClick={proModal.onOpen}>
                    Upgrade
                    <Zap className="w-4 h-4 ml-2 fill-white" size={16} />
                </Button>
            </CardContent>
            </Card>
            </div>
    )
};