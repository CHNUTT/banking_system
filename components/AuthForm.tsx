'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FORM_TYPES } from '@/constants';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import CustomInput from '@/components/form/CustomInput';
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { signIn, signUp } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';
import PlaidLink from './PlaidLink';

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(type === FORM_TYPES.SIGN_UP && {
        firstName: '',
        lastName: '',
        address1: '',
        city: '',
        state: '',
        postalCode: '',
        dateOfBirth: '',
        ssn: '',
      }),
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Sign up with Appwrite & create plaid token
      if (type === FORM_TYPES.SIGN_UP) {
        const userData = {
          firstName: formData.firstName!,
          lastName: formData.lastName!,
          address1: formData.address1!,
          city: formData.city!,
          state: formData.state!,
          postalCode: formData.postalCode!,
          dateOfBirth: formData.dateOfBirth!,
          ssn: formData.ssn!,
          email: formData.email,
          password: formData.password,
        };
        const newUser = await signUp(userData);

        setUser(newUser);
      }
      if (type === FORM_TYPES.SIGN_IN) {
        const response = await signIn({
          email: formData.email,
          password: formData.password,
        });
        if (response) router.push('/');
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='auth-form'>
      <header className='flex flex-col gap-5 md:gap-8'>
        <Link href='/' className='cursor-pointer flex items-center gap-1'>
          <Image
            src='/icons/logo.svg'
            width={34}
            height={34}
            alt='Horizon logo'
          />
          <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>
            Horizon
          </h1>
        </Link>
        <div className='flex flex-col gap-1 md:gap-3'>
          <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
            {user
              ? 'Link Account'
              : type === FORM_TYPES.SIGN_IN
              ? 'Sign In'
              : 'Sign Up'}
          </h1>
          <p className='text-16 font-normal text-gray-600'>
            {user
              ? 'Link your account to get started'
              : 'Please enter your details'}
          </p>
        </div>
      </header>
      {user ? (
        <div className='flex flex-col gap-4'>
          <PlaidLink user={user} variant='primary' />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              {type === FORM_TYPES.SIGN_UP && (
                <>
                  <div className='flex gap-4'>
                    <CustomInput
                      control={form.control}
                      name='firstName'
                      label='First Name'
                      placeholder='Enter your First Name'
                    />
                    <CustomInput
                      control={form.control}
                      name='lastName'
                      label='Last Name'
                      placeholder='Enter your Last Name'
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name='address1'
                    label='Address'
                    placeholder='Enter your specific Address'
                  />
                  <CustomInput
                    control={form.control}
                    name='city'
                    label='City'
                    placeholder='Enter your City'
                  />
                  <div className='flex gap-4'>
                    <CustomInput
                      control={form.control}
                      name='state'
                      label='State'
                      placeholder='ex: NY'
                    />
                    <CustomInput
                      control={form.control}
                      name='postalCode'
                      label='Postal Code'
                      placeholder='11111'
                    />
                  </div>
                  <div className='flex gap-4'>
                    <CustomInput
                      control={form.control}
                      name='dateOfBirth'
                      label='Date of Birth'
                      placeholder='YYYY-MM-DD'
                    />
                    <CustomInput
                      control={form.control}
                      name='ssn'
                      label='SSN'
                      placeholder='Example: 11101'
                    />
                  </div>
                </>
              )}
              <CustomInput
                control={form.control}
                name='email'
                label='Email'
                placeholder='Enter your Email'
              />
              <CustomInput
                control={form.control}
                name='password'
                label='Password'
                placeholder='Enter your Password'
              />
              <div className='flex flex-col gap-4'>
                <Button type='submit' className='form-btn' disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className='animate-spin mr-3' />
                      Loading...
                    </>
                  ) : type === FORM_TYPES.SIGN_IN ? (
                    'Sign In'
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className='flex justify-center gap-1'>
            <p className='text-14 font-normal text-gray-600'>
              {type === FORM_TYPES.SIGN_IN
                ? "Don't have an account?"
                : 'Already have an account?'}
            </p>
            <Link
              href={type === FORM_TYPES.SIGN_IN ? '/sign-up' : '/sign-in'}
              className='form-link'
            >
              {type === FORM_TYPES.SIGN_IN ? 'Sign Up' : 'Sign In'}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};
export default AuthForm;
