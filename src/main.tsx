import './styles/index.css';
import 'nauth-react/styles';
import 'keen-slider/keen-slider.min.css';
import '@/i18n';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { NAuthProvider } from 'nauth-react';
import { Toaster } from 'sonner';

import App from './App';
import { LotteryProvider } from '@/Contexts/LotteryContext';
import { LotteryComboProvider } from '@/Contexts/LotteryComboContext';
import { LotteryImageProvider } from '@/Contexts/LotteryImageContext';
import { RaffleProvider } from '@/Contexts/RaffleContext';
import { RaffleAwardProvider } from '@/Contexts/RaffleAwardContext';
import { TicketProvider } from '@/Contexts/TicketContext';
import { ReferralProvider } from '@/Contexts/ReferralContext';
import { CommissionProvider } from '@/Contexts/CommissionContext';
import { CheckoutProvider } from '@/Contexts/CheckoutContext';

// Ordem da provider chain: Commission → Referral → Ticket → RaffleAward →
// Raffle → LotteryImage → LotteryCombo → Lottery → Checkout (mais externo → mais interno).

const NAUTH_STORAGE_KEY = 'fortuno:nauth';

const nauthConfig = {
  apiUrl: import.meta.env.VITE_NAUTH_API_URL,
  storageKey: NAUTH_STORAGE_KEY,
  storageType: 'localStorage' as const,
  headers: {
    'X-Tenant-Id': import.meta.env.VITE_NAUTH_TENANT,
  },
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.VITE_SITE_BASENAME || '/'}>
      <NAuthProvider config={nauthConfig}>
        <CommissionProvider>
          <ReferralProvider>
            <TicketProvider>
              <RaffleAwardProvider>
                <RaffleProvider>
                  <LotteryImageProvider>
                    <LotteryComboProvider>
                      <LotteryProvider>
                        <CheckoutProvider>
                          <Toaster richColors position="top-right" />
                          <App />
                        </CheckoutProvider>
                      </LotteryProvider>
                    </LotteryComboProvider>
                  </LotteryImageProvider>
                </RaffleProvider>
              </RaffleAwardProvider>
            </TicketProvider>
          </ReferralProvider>
        </CommissionProvider>
      </NAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
