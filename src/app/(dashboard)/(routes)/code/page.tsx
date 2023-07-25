// ask page
'use client';

// Global imports
import * as z from 'zod';
import { Code, Divide, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { ChatCompletionRequestMessage } from 'openai';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';

// Local imports
import { Heading } from '@/components/Heading';
import { formSchema } from './constants';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Empty } from '@/components/Empty';
import { Loader } from '@/components/Loader';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';
import { useProModel } from '@/hooks/use-pro-modal';

const askPage = () => {
  const ProModal = useProModel();
  // messages state
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  // extract the loading state from form
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values); // testing
    // modify message array and make POST request via axios
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: 'user',
        content: values.prompt,
      };
      // newMessages = array and new message (not push)
      const newMessages = [...messages, userMessage];

      // api call via axios
      const response = await axios.post('/api/code', {
        messages: newMessages,
      });
      console.log(response.data.content); // testing
      // set messages
      setMessages((current) => [...current, userMessage, response.data]);
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
        title='Code Generation'
        description='Generate Code using descriptive text.'
        icon={Code}
        iconColor='text-green-700'
        bgColor='bg-green-700/10'
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
                <FormItem className='col-span-12 lg:col-span-10'>
                  <FormControl className='m-0 p-0'>
                    <Input
                      className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                      disabled={isLoading}
                      placeholder='Simple toggle button using react hooks.'
                      {...field} // onChange, value, name, blur, etc
                    />
                  </FormControl>
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
      {/* Messages */}
      <div className='space-y-4 mt-4'>
        {isLoading && (
          <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
            <Loader />
          </div>
        )}
        {/* Check for messages */}
        {messages.length === 0 && !isLoading && (
          <div>
            <Empty label='No asks started.' />
          </div>
        )}
        <div className='flex flex-col-reverse gap-y-4'>
          {/* map messages */}
          {messages.map((message) => (
            <div
              key={message.content}
              className={cn(
                'p-8 w-full flex items-start gap-x-8 rounded-lg',
                message.role === 'user'
                  ? 'bg-white border border-black/10'
                  : 'bg-muted'
              )}
            >
              {/* render bot / user */}
              {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
              {/* Markdown */}
              <ReactMarkdown
                components={{
                  pre: ({ node, ...props }) => (
                    <div className='overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg'>
                      <pre {...props} />
                    </div>
                  ),
                  code: ({ node, ...props }) => (
                    // highlight the "code" snippets bg-black/10
                    <code
                      className='bg-black/10 rounded-lg p-1'
                      {...props}
                    />
                  ),
                }}
                className='text-sm overflow-hidden leading-7'
              >
                {message.content || ''}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default askPage;
