import { UserEditForm } from 'nauth-react';

export const ProfileEditPage = (): JSX.Element => (
  <main className="mx-auto max-w-2xl px-4 py-10">
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="mb-4 font-display text-2xl text-fortuno-black">Meus dados</h1>
      <UserEditForm />
    </div>
  </main>
);
