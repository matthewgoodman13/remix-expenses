import AuthForm from '~/components/auth/AuthForm';
import { login, signup } from '~/data/auth.server';
import { validateCredentials } from '~/data/validation.server';
import authStyles from '~/styles/auth.css';

export default function AuthPage() {
  return (
    <div className="">
      <AuthForm />
    </div>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: authStyles }];
}

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get('mode') || 'login';

  const formData = await request.formData();
  const authData = Object.fromEntries(formData);

  try {
    validateCredentials(authData);
  } catch (error) {
    return error;
  }

  // Validate authData
  try {
    if (authMode === 'login') {
      return await login(authData);
    } else {
      return await signup(authData);
    }
  } catch (error) {
    if (error.status === 422) {
      return {
        credentials: error.message,
      };
    }
    throw error;
  }
}

export function headers({ actionHeaders, loaderHeaders, parentHeaders }) {
  return {
    'Cache-Control': parentHeaders.get('Cache-Control'),
  };
}
