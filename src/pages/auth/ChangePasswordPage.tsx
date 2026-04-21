import { ChangePasswordForm } from 'nauth-react';
import { useNavigate } from 'react-router-dom';

export const ChangePasswordPage = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-4 font-display text-2xl text-fortuno-black">Alterar senha</h1>
        <ChangePasswordForm onSuccess={() => navigate('/dashboard')} />
      </div>
    </main>
  );
};
