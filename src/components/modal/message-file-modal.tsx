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
  FormMessage,
} from '@/components/ui/form';
import { useModal } from '@/hooks/use-modal-store';
import axios from '@/services/axios-request';
import { zodResolver } from '@hookform/resolvers/zod';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

const formSchema = z.object({
  file: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, {
      message: 'Server image is required',
    }),
});

const MessageFileModel = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === 'messageFile';
  const { apiUrl, query } = data;
  const { t } = useTranslation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { file } = values;
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await axios.post('resource/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      });
      await axios.post(url, { content: data, isFile: '1' });
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
            {t('Add an attachment')}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {t('Send a file as a message')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          type="both"
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
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} type="submit" variant="primary">
                {t('Send')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModel;
