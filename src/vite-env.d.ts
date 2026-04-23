/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_FORTUNO_TENANT_ID: string;
  readonly VITE_FORTUNO_STORE_ID: string;
  readonly VITE_NAUTH_API_URL: string;
  readonly VITE_NAUTH_TENANT: string;
  readonly VITE_SITE_BASENAME: string;
  readonly VITE_WHATSAPP_URL: string;
  readonly VITE_INSTAGRAM_URL: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_COMPANY_NAME?: string;
  readonly VITE_COMPANY_CNPJ?: string;
  readonly VITE_COMPANY_ADDRESS?: string;
  readonly VITE_COMPANY_BUSINESS_HOURS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
