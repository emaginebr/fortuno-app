import { LoginForm } from 'nauth-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  from?: string;
}

export const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const from = state?.from ?? '/dashboard';

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-fortuno-green-deep px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-fortuno-offwhite p-8 shadow-lg">
        <div className="mb-6 text-center">
          <img src="/logo-dark.png" alt="Fortuno" className="mx-auto h-14" />
        </div>
        <LoginForm onSuccess={() => navigate(from, { replace: true })} />
        <div className="mt-6 flex justify-between text-sm">
          <Link to="/esqueci-senha" className="text-fortuno-gold-intense hover:underline">
            Esqueci minha senha
          </Link>
          <Link to="/cadastro" className="text-fortuno-gold-intense hover:underline">
            Cadastrar
          </Link>
        </div>
      </div>
    </main>
  );
};
