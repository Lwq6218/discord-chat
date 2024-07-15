import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

import { Icons } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

export default function SignInPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formSchema = z.object({
    username: z.string().min(1, { message: 'username is required' }).max(50),
    password: z.string().min(1, { message: 'password is required' }).max(100),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const { signIn } = useAuth();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await signIn(values.username, values.password);
      navigate('/devflow/questions');
    } catch (error) {
      console.log(values);
    } finally {
      setIsLoading(false);
    }
  }
  const navigate = useNavigate();
  const handleOnclick = () => {
    navigate('/user/sign-up');
  };
  return (
    <>
      <Card className="relative w-full dark:bg-[#313338]">
        <CardHeader className="mt-6 space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            {t('Login')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('Enter your name and password to login to your account')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label>{t('Name')}</Label>
                    <FormControl>
                      <Input {...field} className="dark:bg-[#1e1f22]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>{t('Password')}</Label>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="dark:bg-[#1e1f22]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full capitalize"
                variant="primary"
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {t('login')}
              </Button>
            </form>
          </Form>
          <div className="mt-4 block text-center">
            {t("Don't have an account?")}
            <Button
              variant="link"
              className="text-blue-500"
              onClick={() => handleOnclick()}
            >
              {t('Sign up')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
