// Pro Modal
"use client";

import { useProModel } from "@/hooks/use-pro-modal";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { DialogDescription } from "./ui/dialog";
import {
  Check,
  Code,
  Image,
  MessageSquare,
  Music,
  VideoIcon,
  Zap,
} from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";
import { toast } from 'react-hot-toast';

// Array of available tools
const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Image Generation",
    icon: Image,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
  },
];

export const ProModal = () => {
  const proModal = useProModel();
  const [loading, setLoading] = useState(false);
  // onSubscribe
  const onSubscribe = async () => {
    try {
      setLoading(true);
      // get data
      const response = await axios.get("/api/stripe");
      //
      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something went wrong.");
      console.log("STRIPE_CLIENT_ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              Upgrade to Genius
              <Badge className="uppercase text-sm py-1" variant="premium">
                Pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {/* tools  */}
            {tools.map((tool) => (
              <Card
                key={tool.label}
                className="p-3 border-black/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    {/* icons */}
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  {/* label */}
                  <div className="font-semibold text-sm">{tool.label}</div>
                  {/* check */}
                  <Check className="text-primary w-5 h-5" />
                </div>
              </Card>
            ))}
          </DialogDescription>
          {/* footer */}
          <DialogFooter>
            {/* Button */}
            <Button
              disabled={loading}
              onClick={onSubscribe}
              size="lg"
              variant="premium"
              className="w-full"
            >
              Upgrade
              <Zap className="w-4 h-4 ml-2 fill-white" />
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
