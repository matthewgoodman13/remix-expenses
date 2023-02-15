import AuthForm from '~/components/auth/AuthForm';
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

  // Validate authData

  if (authMode === 'login') {
    // Login
  } else {
    // Signup
  }
}
