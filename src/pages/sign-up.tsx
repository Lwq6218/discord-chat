import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z
  .object({
    name: z.string().min(1, { message: 'username is required' }).max(50),
    password: z.string().min(1, { message: 'password is required' }).max(100),
    confirmPassword: z
      .string()
      .min(1, { message: 'confirm password is required' })
      .max(100),
    verifyCode: z
      .string()
      .min(4, { message: 'verify code is required' })
      .max(4),
    email: z.string().email(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    { message: 'Password must match!', path: ['confirmPassword'] }
  );

export default function SignInPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
      email: '',
    },
  });
  const { signUp } = useAuth();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (!sessionId) {
      return;
    }
    const { name, password, verifyCode } = values;
    try {
      await signUp(name, password, verifyCode, sessionId);
      navigate('/user/sign-in');
    } catch (error) {
      console.log(values);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignInClick = () => {
    navigate('/user/sign-in');
  };
  // 获取验证码图片
  const fetchCaptcha = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    try {
      const response = await axios.get('/resource/img_verify_code');
      setCaptcha(response.data.img);
      setSessionId(response.data.sessionId);
    } catch (error) {
      console.error('Error fetching captcha:', error);
    }
  };
  useEffect(() => {
    fetchCaptcha();
  }, []);
  return (
    <>
      <Card className="w-full items-center dark:bg-[#313338]">
        <Button
          variant="ghost"
          onClick={handleSignInClick}
          className="absolute right-4 top-10 font-semibold md:right-8 md:top-8"
        >
          {t('Login')}
        </Button>
        <CardHeader className="mt-10 space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            {t('Sign up')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('Create an account to start chatting with your friends')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>{t('Email')}</Label>
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
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          className="dark:bg-[#1e1f22]"
                        />
                        <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3">
                          {showPassword ? (
                            <EyeIcon
                              className="h-6 w-6"
                              onClick={togglePasswordVisibility}
                            />
                          ) : (
                            <EyeOffIcon
                              className="h-6 w-6"
                              onClick={togglePasswordVisibility}
                            />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label>{t('Confirm Password')}</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...field}
                          className="dark:bg-[#1e1f22]"
                        />
                        <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3">
                          {showConfirmPassword ? (
                            <EyeIcon
                              className="h-6 w-6"
                              onClick={toggleConfirmPasswordVisibility}
                            />
                          ) : (
                            <EyeOffIcon
                              className="h-6 w-6"
                              onClick={toggleConfirmPasswordVisibility}
                            />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="verifyCode"
                render={({ field }) => (
                  <FormItem>
                    <Label>{t('VerifyCode')}</Label>
                    <div className="flex justify-between">
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>

                      {captcha && (
                        <button onClick={(e) => fetchCaptcha(e)}>
                          <img
                            src={`data:image/png;base64,${captcha}`}
                            alt="captcha"
                            className="w-26 h-10 object-contain"
                          />
                        </button>
                      )}
                    </div>
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
                {t('Register')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
