import { useState } from 'react';
import { LoginForm, RegisterForm, useAuth } from 'nauth-react';
import { useCheckout } from '@/hooks/useCheckout';

export const AuthGateStep = (): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const checkout = useCheckout();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (isAuthenticated) {
    checkout.goToStep('numbers');
    return <></>;
  }

  const handleSuccess = (): void => {
    checkout.goToStep('numbers');
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="font-display text-2xl text-fortuno-black">Identifique-se para continuar</h1>
      <p className="mt-2 text-sm text-fortuno-black/70">
        Para comprar bilhetes, você precisa ter uma conta Fortuno. É rápido.
      </p>

      <div className="mt-6 flex gap-2 border-b border-fortuno-black/10">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold ${
            mode === 'login'
              ? 'border-fortuno-gold-intense text-fortuno-black'
              : 'border-transparent text-fortuno-black/50'
          }`}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold ${
            mode === 'register'
              ? 'border-fortuno-gold-intense text-fortuno-black'
              : 'border-transparent text-fortuno-black/50'
          }`}
        >
          Cadastrar
        </button>
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        {mode === 'login' ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
};
