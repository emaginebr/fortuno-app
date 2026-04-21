import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const AuthenticatedShell = (): JSX.Element => (
  <div className="flex min-h-screen flex-col bg-fortuno-offwhite text-fortuno-black">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);
