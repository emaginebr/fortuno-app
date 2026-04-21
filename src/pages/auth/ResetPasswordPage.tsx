import { ResetPasswordForm } from 'nauth-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ResetPasswordPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const hash = params.get('hash') ?? '';

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-fortuno-green-deep px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-fortuno-offwhite p-8 shadow-lg">
        <h1 className="mb-4 font-display text-2xl text-fortuno-black">Redefinir senha</h1>
        <ResetPasswordForm recoveryHash={hash} onSuccess={() => navigate('/login')} />
      </div>
    </main>
  );
};
