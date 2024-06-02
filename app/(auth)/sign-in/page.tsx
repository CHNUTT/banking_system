import AuthForm from '@/components/AuthForm';
import { FORM_TYPES } from '@/constants';

const SignIn = () => {
  return (
    <section className='flex-center size-full max-sm:px-6'>
      <AuthForm type={FORM_TYPES.SIGN_IN} />
    </section>
  );
};

export default SignIn;
