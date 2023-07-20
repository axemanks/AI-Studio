// Video page
"use client";

// Global imports
import * as z from "zod";
import { Music, VideoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

// Local imports
import { Heading } from "@/components/Heading";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/Empty";
import { Loader } from "@/components/Loader";
import { useProModel } from "@/hooks/use-pro-modal";

const VideoGeneration = () => {
  const ProModal = useProModel();
  const [video, setVideo] = useState<string>();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  // extract the loading state from form
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values); // testing
    // modify message array and make POST request via axios
    try {
      setVideo(undefined); // clear music

      // api call via axios
      const response = await axios.post("/api/video", values);
      setVideo(response.data[0]);

      form.reset(); // clear
    } catch (error: any) {
      // if 403 Open Pro Modal
      if (error?.response?.status === 403) {
        ProModal.onOpen();
      }

      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Turn your prompt into a video clip."
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Clown fish swimming in a coral reef"
                      {...field} // onChange, value, name, blur, etc
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Generate Button */}
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              disabled={isLoading}
            >
              Generate
            </Button>
          </form>
        </Form>
      </div>
      {/* Messages */}
      <div className="space-y-4 mt-4">
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        {/* Check for video */}
        {!video && !isLoading && (
          <div>
            <Empty label="No video Generated." />
          </div>
        )}
        {/* Video playback */}
        {video && (
          <video
            controls
            className="w-full aspect-video mt-8 rounded-lg bg-black"
          >
            <source src={video} />
          </video>
        )}
      </div>
    </div>
  );
};

export default VideoGeneration;
