import { Route, Routes } from 'react-router-dom';

import { AuthenticatedShell } from '@/components/layout/AuthenticatedShell';
import { ProtectedRoute } from '@/components/route-guards/ProtectedRoute';

import { HomePage } from '@/pages/public/HomePage';
import { LotteryListPage } from '@/pages/public/LotteryListPage';
import { LotteryDetailPage } from '@/pages/public/LotteryDetailPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { ContactPage } from '@/pages/public/ContactPage';

import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { ChangePasswordPage } from '@/pages/auth/ChangePasswordPage';
import { ProfileEditPage } from '@/pages/auth/ProfileEditPage';

import { CheckoutPage } from '@/pages/checkout/CheckoutPage';

import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { MyNumbersPage } from '@/pages/dashboard/MyNumbersPage';
import { MyPointsPage } from '@/pages/dashboard/MyPointsPage';
import { MyLotteriesPage } from '@/pages/dashboard/MyLotteriesPage';

import { LotteryWizardPage } from '@/pages/admin/LotteryWizardPage';

const App = (): JSX.Element => (
  <Routes>
    {/* Rotas públicas com header+footer */}
    <Route element={<AuthenticatedShell />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/sorteios" element={<LotteryListPage />} />
      <Route path="/sorteios/:slug" element={<LotteryDetailPage />} />
      <Route path="/quem-somos" element={<AboutPage />} />
      <Route path="/fale-conosco" element={<ContactPage />} />
      <Route path="/checkout/:lotteryId" element={<CheckoutPage />} />

      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meus-numeros" element={<MyNumbersPage />} />
        <Route path="/meus-pontos" element={<MyPointsPage />} />
        <Route path="/meus-sorteios" element={<MyLotteriesPage />} />
        <Route path="/meus-sorteios/novo" element={<LotteryWizardPage />} />
        <Route path="/meus-sorteios/:id/editar" element={<LotteryWizardPage />} />
        <Route path="/conta/alterar-senha" element={<ChangePasswordPage />} />
        <Route path="/conta/dados" element={<ProfileEditPage />} />
      </Route>
    </Route>

    {/* Rotas de auth sem shell (fundo dark dedicado) */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/cadastro" element={<RegisterPage />} />
    <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
    <Route path="/recuperar-senha" element={<ResetPasswordPage />} />
  </Routes>
);

export default App;
