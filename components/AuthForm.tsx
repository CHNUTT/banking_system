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

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    console.log(values);
    setIsLoading(false);
  }

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
        <div className='flex flex-col gap-4'>{/* {PlaidLink} */}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              {type === FORM_TYPES.SIGN_UP && (
                <>
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
                  <CustomInput
                    control={form.control}
                    name='address1'
                    label='Address'
                    placeholder='Enter your specific Address'
                  />
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
