import FileUpload from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModal } from '@/hooks/use-modal-store';
import axios from '@/services/axios-request';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Server name is required' }),
  image: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, {
      message: 'Server image is required',
    }),
});

const CreateServerModel = () => {
  const navigate = useNavigate();
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === 'createServer';
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: null,
    },
  });
  const isLoading = form.formState.isSubmitting;

  const mutation = useMutation({
    mutationFn: (values: unknown) => {
      return axios.post(`/server`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { image, name } = values;
    if (!image) return;
    try {
      const formData = new FormData();
      formData.append('file', image);
      const { data } = await axios.post('resource/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const res = await mutation.mutateAsync({ name, imageUrl: data });
      console.log('mutation server', res);
      navigate(`/servers/${res.data.id}`, { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      handleClose();
    }
  };
  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            {t('Create your server')}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {t(
              'Give your server a personality with a name and an image. You can always change it later.'
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          type="image"
                          onChange={(files) => {
                            field.onChange(files);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                      {t('Server name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder={t('Enter server name')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} type="submit">
                {t('Create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModel;
