import { RegisterForm } from 'nauth-react';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-fortuno-green-deep px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-fortuno-offwhite p-8 shadow-lg">
        <div className="mb-6 text-center">
          <img src="/logo-dark.png" alt="Fortuno" className="mx-auto h-14" />
          <h1 className="mt-4 font-display text-2xl text-fortuno-black">Crie sua conta</h1>
        </div>
        <RegisterForm onSuccess={() => navigate('/dashboard', { replace: true })} />
      </div>
    </main>
  );
};
