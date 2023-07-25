// ask page
'use client';

// Global imports
import * as z from 'zod';
import { DownloadIcon, ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Local imports
import { Heading } from '@/components/Heading';
import { amountOptions, formSchema, resolutionOptions } from './constants';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Empty } from '@/components/Empty';
import { Loader } from '@/components/Loader';
import { cn } from '@/lib/utils';
import { useProModel } from '@/hooks/use-pro-modal';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

const ImagePage = () => {
  const ProModal = useProModel();
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  // Form default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      amount: '1',
      resolution: '512x512',
    },
  });

  // extract the loading state from form
  const isLoading = form.formState.isSubmitting;

  // On Submit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values); // testing

    try {
      setImages([]); // clear images array
      const response = await axios.post('/api/image', values);
      // opean ai is expecting an array of urls...
      // get just the urls
      const urls = response.data.map((image: { url: string }) => image.url);
      // set the images
      setImages(urls);

      form.reset(); // clear
    } catch (error: any) {
      // if 403 Open Pro Modal
      if (error?.response?.status === 403) {
        ProModal.onOpen();
      } else {
        // TOAST
        toast.error('Something went wrong.');
      }
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title='Image Generation'
        description='Turn your prompt into an image.'
        icon={ImageIcon}
        iconColor='text-pink-700'
        bgColor='bg-pink-700/10'
      />
      <div className='px-4 lg:px-8'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'
          >
            <FormField
              name='prompt'
              render={({ field }) => (
                <FormItem className='col-span-12 lg:col-span-6'>
                  <FormControl className='m-0 p-0'>
                    <Input
                      className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                      disabled={isLoading}
                      placeholder='A picture of a horse in the Swiss Alps'
                      {...field} // onChange, value, name, blur, etc
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Number of Images */}
            <FormField
              name='amount'
              control={form.control}
              render={({ field }) => (
                <FormItem className='col-span-12 lg:col-span-2'>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amountOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {/* Resolution */}
            <FormField
              name='resolution'
              control={form.control}
              render={({ field }) => (
                <FormItem className='col-span-12 lg:col-span-2'>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Generate Button */}
            <Button
              className='col-span-12 lg:col-span-2 w-full'
              disabled={isLoading}
            >
              Generate
            </Button>
          </form>
        </Form>
      </div>
      {/* Images */}
      <div className='space-y-4 mt-4'>
        {isLoading && (
          <div className='p-20'>
            <Loader />
          </div>
        )}
        {/* Check for Images */}
        {images.length === 0 && !isLoading && (
          <div>
            <Empty label='No images generated yet.' />
          </div>
        )}
        {/* display image */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid:cols-4 gap-4 mt-8'>
          {/* src = url */}
          {images.map((src) => (
            <Card
              key={src}
              className='rounded-lg overflow-hidden'
            >
              <div className='relative aspect-square'>
                <Image
                  alt='image'
                  fill
                  src={src}
                />
              </div>
              <CardFooter className='p-2'>
                <Button
                  variant='secondary'
                  className='w-full'
                  onClick={() => window.open(src)}
                >
                  <DownloadIcon className='h-4 w-4 mr-2' />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
