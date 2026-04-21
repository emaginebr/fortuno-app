import { ForgotPasswordForm } from 'nauth-react';
import { useNavigate } from 'react-router-dom';

export const ForgotPasswordPage = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-fortuno-green-deep px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-fortuno-offwhite p-8 shadow-lg">
        <h1 className="mb-4 font-display text-2xl text-fortuno-black">Recuperar senha</h1>
        <ForgotPasswordForm onSuccess={() => navigate('/login')} />
      </div>
    </main>
  );
};
