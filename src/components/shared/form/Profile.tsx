import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';

interface Props {
  user: {
    id: string;
    name: string;
    nickName: string;
    imageUrl: string;
    email: string;
    phone: string;
  };
}
const ProfileSchema = z.object({
  name: z.string().min(2).max(50),
  nickName: z.string().min(2).max(15),
  email: z.string().email(),
  phone: z.string().min(11).max(11).optional(),
});

export default function Profile({ user }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || '',
      nickName: user.nickName || '',
      email: user.email || '',
      phone: user.phone || '',
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true);
    try {
      //先上传图片
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axios.post('resource/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        //再更新用户信息
        await axios.patch(`/user/${user.id}`, {
          ...values,
          imageUrl: data,
        });
      } else {
        await axios.patch(`/user/${user.id}`, {
          ...values,
        });
      }

      navigate(`/devflow/profile/${user.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const [previewUrl, setPreviewUrl] = useState<string>(user.imageUrl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (event: any) => {
    event.stopPropagation();
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 触发<input type="file">的点击事件
    }
  };
  return (
    <>
      <div className="flex items-center space-x-3">
        <img
          src={previewUrl}
          alt="Avatar"
          width="96"
          height="96"
          className="rounded-full"
        />
        <div className="space-y-1">
          <Button size="sm" variant="ghost" onClick={handleClick}>
            {t('Change Picture')}
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }} // 隐藏<input type="file">
          />
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-9 flex w-full flex-col gap-9"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  {t('Name')} <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nickName"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  {t('Nickname')} <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  {t('Email')}
                  <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="me@email.com"
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  {t('Phone')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your phone number"
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-7 flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('Save...') : t('Save')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
