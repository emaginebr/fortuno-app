# Handoff — `/fale-conosco` (ContactPage) · Editorial Casino Noir

Documento de implementação para `frontend-react-developer`. Gera o redesign
completo da `ContactPage` (arquivo atual: `src/pages/public/ContactPage.tsx`)
como página institucional **curta e funcional** da marca.

Dependências de design já aprovadas:

- `design/wizard-vertical/` — tokens base
- `design/home/` — fornece `FraudCertificate`, `ClosingCTA` (padrão)
- `design/dashboard/` — variante LIGHT BODY (paper cards, shadows)
- `design/about/` — hero editorial compacto, padrão eyebrow por capítulo, closing CTA
- `design/contact/tokens.md` — apenas tokens novos para SLA chip, inputs, acordeão e institutional card

Mockup de referência: `design/contact/mockup.html` (preview standalone).

---

## 1. Árvore de componentes

```
<AuthenticatedShell>  (já existe — provê Header + Footer globais)
 └── <ContactPage>
      ├── <ContactHero />                   [NOVO]
      ├── <ContactChannelsGrid />           [NOVO — compõe ContactChannelCard]
      │    └── <ContactChannelCard />       [NOVO — reutilizável]
      ├── <ContactForm />                   [NOVO]
      ├── <ContactInstitutionalCard />      [NOVO]
      ├── <ContactFaq />                    [NOVO]
      └── <ContactClosingCta />             [NOVO ou REUSO de AboutClosingCta]
```

### Recomendação: compartilhar o ClosingCta

O `AboutClosingCta` da página `/quem-somos` tem exatamente a mesma
estrutura visual necessária aqui. **Refatorar** `AboutClosingCta` →
`ClosingCta` com props, e consumir em ambas as páginas:

```ts
interface ClosingCtaProps {
  eyebrow: string;        // "Epílogo" (about) | "Ainda em dúvida?" (contact)
  title: ReactNode;       // aceita line-break + itálico
  subtitle: string;
  primary: { href: string; label: string; icon: LucideIcon; external?: boolean };
  secondary?: { href: string; label: string; icon?: LucideIcon };
  signature?: string;     // "Sua sorte é séria." (default)
  compact?: boolean;      // true → paddings menores (usar em contact)
}
```

Caminho: `src/components/shared/ClosingCta.tsx`. Se preferir não
refatorar agora, criar `ContactClosingCta.tsx` espelho e documentar
o refactor como follow-up.

---

## 2. DOM por seção (Tailwind exato)

Shell externo da página:

```tsx
<main className="bg-[color:var(--dash-bg-page)] text-fortuno-black min-h-screen">
  <ContactHero />
  <ContactChannelsGrid />
  <ContactForm />
  <ContactInstitutionalCard />
  <ContactFaq />
  <ContactClosingCta />
</main>
```

### 2.1 `<ContactHero />`

Hero institucional **compacto** (não toma viewport inteira). Variante
encolhida do `AboutHero`: mesmo halo ouro lateral, mesmas linhas
ornamentais, sem CTAs primários (só trust bar).

```tsx
<section
  className="relative bg-contact-hero-halo pt-14 md:pt-20 pb-14 md:pb-20
             before:absolute before:top-0 before:left-[12%] before:right-[12%] before:h-px before:bg-[image:var(--gold-divider)]
             after:absolute  after:bottom-0 after:left-[22%]  after:right-[22%] after:h-px after:bg-[image:var(--gold-divider-soft)]"
  aria-labelledby="contact-hero-title"
>
  <div className="mx-auto max-w-6xl px-6">
    <div className="grid md:grid-cols-[1.4fr_0.8fr] gap-10 md:gap-14 items-center">

      {/* Texto */}
      <div>
        <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold">
          <span className="inline-block w-8 h-px bg-fortuno-gold-intense/70" />
          Fortuno · Canais oficiais
          <span className="inline-block w-8 h-px bg-fortuno-gold-intense/70" />
        </span>

        <h1
          id="contact-hero-title"
          className="font-display mt-5 md:mt-6 text-fortuno-black leading-[1.02]"
          style={{ fontSize: 'clamp(36px, 5vw, 58px)', letterSpacing: '-0.02em' }}
        >
          Estamos <span className="italic text-fortuno-gold-intense">por perto.</span>
        </h1>

        <p className="mt-5 md:mt-6 text-[16px] md:text-[17px] leading-relaxed text-fortuno-black/70 max-w-lg">
          Escolha o canal que preferir. Respondemos em até <strong className="text-fortuno-black/85">1 dia útil</strong>
          {' '}— e, no WhatsApp, geralmente em menos de 4 horas.
        </p>

        {/* Trust bar */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-fortuno-black/55">
          <TrustItem icon={Clock4} label="Seg. a sex., 9h às 18h" />
          <Dot />
          <TrustItem icon={MapPin} label="Brasil · Fuso BRT" />
          <Dot />
          <TrustItem icon={ShieldCheck} label="LGPD · dados protegidos" />
        </div>
      </div>

      {/* Glyph decorativo */}
      <figure
        className="relative order-first md:order-last aspect-square max-w-[260px] md:max-w-none mx-auto
                   grid place-items-center rounded-[24px] border border-fortuno-gold-intense/24
                   bg-[radial-gradient(120%_120%_at_30%_20%,rgba(212,175,55,0.14)_0%,transparent_55%),linear-gradient(180deg,#faf5e8_0%,#ece8e1_100%)]
                   shadow-paper overflow-hidden
                   before:absolute before:inset-3 before:border before:border-fortuno-gold-intense/22 before:rounded-[16px] before:pointer-events-none
                   after:absolute after:inset-0 after:m-auto after:w-[68%] after:aspect-square after:rounded-full after:border after:border-dashed after:border-fortuno-gold-intense/28 after:pointer-events-none"
        aria-hidden="true"
      >
        <MessagesSquare className="w-[44%] h-[44%] text-fortuno-gold-intense opacity-90" strokeWidth={1.25} />
      </figure>

    </div>
  </div>
</section>
```

**Copy oficial**:
- Eyebrow: `Fortuno · Canais oficiais`
- Title: `Estamos por perto.` (a palavra "por perto." em itálico ouro)
- Subtitle: `Escolha o canal que preferir. Respondemos em até 1 dia útil — e, no WhatsApp, geralmente em menos de 4 horas.`
- Trust bar: `Seg. a sex., 9h às 18h` · `Brasil · Fuso BRT` · `LGPD · dados protegidos`

### 2.2 `<ContactChannelsGrid />` + `<ContactChannelCard />`

Grid 3 colunas (1 col mobile). Cards consomem `ContactChannelCard` com
props tipadas:

```ts
interface ContactChannel {
  key: 'whatsapp' | 'instagram' | 'email';
  icon: LucideIcon;                  // MessageCircle | Instagram | Mail
  label: string;                     // "WhatsApp"
  description: string;
  href: string | undefined;          // vindo de env var
  ctaLabel: string;                  // "Abrir WhatsApp"
  external: boolean;                 // true p/ whatsapp/instagram; false p/ mailto
  sla: { label: string; aria: string }; // { label: "Resposta em 4h", aria: "Tempo médio de resposta: menos de 4 horas" }
}
```

Implementação:

```tsx
<section className="relative z-10 py-16 md:py-20" aria-labelledby="channels-title">
  <div className="mx-auto max-w-6xl px-6">

    <div className="max-w-2xl mb-10 md:mb-12">
      <Eyebrow chapter="I" label="Canais" />
      <h2
        id="channels-title"
        className="font-display mt-4 text-fortuno-black leading-[1.05]"
        style={{ fontSize: 'clamp(28px, 3.6vw, 40px)', letterSpacing: '-0.02em' }}
      >
        Escolha como prefere{' '}
        <span className="italic text-fortuno-gold-intense">conversar.</span>
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
      {channels.map((channel) => (
        <ContactChannelCard key={channel.key} {...channel} />
      ))}
    </div>

  </div>
</section>
```

`<ContactChannelCard />`:

```tsx
<a
  href={href}
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}
  aria-label={external ? `Abrir ${label} em nova aba` : `Enviar e-mail para ${label}`}
  className="relative flex flex-col gap-4 p-7 bg-white border border-fortuno-black/[0.08] rounded-[20px]
             shadow-paper no-underline text-fortuno-black overflow-hidden
             transition-[transform,border-color,box-shadow] duration-200
             hover:-translate-y-1 hover:shadow-paper-hover hover:border-fortuno-gold-intense/45
             focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(212,175,55,0.55),var(--shadow-paper-hover)]
             focus-visible:border-fortuno-gold-intense/55
             before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px
             before:bg-[image:var(--card-gold-bar)] before:opacity-85"
>
  {/* SLA chip */}
  <span
    className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold
               tracking-[0.18em] uppercase text-[color:var(--sla-chip-fg)]
               bg-[color:var(--sla-chip-bg)] border border-[color:var(--sla-chip-border)] rounded-full"
    aria-label={sla.aria}
  >
    <span
      className="w-1.5 h-1.5 rounded-full bg-fortuno-gold-intense shadow-[0_0_0_3px_rgba(184,150,63,0.18)]"
      aria-hidden="true"
    />
    {sla.label}
  </span>

  {/* Ícone grande */}
  <div
    className="w-16 h-16 rounded-full grid place-items-center
               bg-gradient-to-b from-[#faf3e1] to-[#f0e3b8]
               text-fortuno-gold-intense border border-fortuno-gold-intense/32
               shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_6px_14px_-6px_rgba(184,150,63,0.35)]"
    aria-hidden="true"
  >
    <Icon className="w-7 h-7" />
  </div>

  <div>
    <h3 className="font-display italic font-bold text-[24px] leading-[1.1] text-fortuno-black">
      {label}
    </h3>
    <p className="mt-2 text-sm leading-[1.65] text-fortuno-black/68">
      {description}
    </p>
  </div>

  <span className="inline-flex items-center gap-1.5 mt-auto pt-2.5 font-semibold
                   text-[13.5px] tracking-wide text-fortuno-gold-intense
                   border-t border-fortuno-gold-intense/22">
    {ctaLabel}
    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
  </span>
</a>
```

**Copy oficial dos canais** (pt-BR):

| Canal      | Label       | Description                                                                        | CTA                      | SLA label           | SLA aria                                       |
|------------|-------------|------------------------------------------------------------------------------------|--------------------------|---------------------|------------------------------------------------|
| WhatsApp   | WhatsApp    | Canal mais rápido. Atendimento humano de segunda a sexta, das 9h às 18h.           | Abrir WhatsApp           | Resposta em 4h      | Tempo médio de resposta: menos de 4 horas      |
| Instagram  | Instagram   | Acompanhe novidades, sorteios em andamento e fale com a gente no direct.           | Abrir @fortuno           | Resposta em 1 dia   | Tempo médio de resposta: em 1 dia útil         |
| E-mail     | E-mail      | Para demandas formais, parcerias e documentos. Respondemos pelo mesmo canal.       | contato@fortuno.com.br   | Resposta em 1 dia   | Tempo médio de resposta: em 1 dia útil         |

**Decisão de iconografia**: **Lucide-react puro**. `MessageCircle` para
WhatsApp (balão genérico — evita usar logo de terceiros sem licença),
`Instagram` (tem Lucide nativo), `Mail`. O chip "Resposta em 4h" +
label "WhatsApp" + cor ouro já dão identidade suficiente sem precisar
do logo oficial. Zero emojis. Zero SVG inline. Consistente com o resto
da plataforma.

**Filtro automático**: manter a lógica atual (remove canais sem URL).
Se `VITE_WHATSAPP_URL` estiver vazia em produção, o card WhatsApp
não renderiza (e o grid vira 2 colunas automaticamente via `auto-fit`
não — explicitamente: se tiver 3 canais, 3 colunas; se 2, 2 colunas
centralizadas; se 1, 1 coluna centralizada com `max-w-sm mx-auto`).

### 2.3 `<ContactForm />`

Formulário controlado com estado local. **Endpoint não existe** —
simulação com `setTimeout` até backend expor `POST /contact/messages`.

```tsx
<section id="mensagem" className="relative z-10 py-16 md:py-20" aria-labelledby="form-title">
  <div className="mx-auto max-w-4xl px-6">

    <div className="text-center mb-10 md:mb-12">
      <Eyebrow chapter="II" label="Mensagem" centered />
      <h2
        id="form-title"
        className="font-display mt-4 text-fortuno-black leading-[1.05]"
        style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.02em' }}
      >
        Envie sua <span className="italic text-fortuno-gold-intense">mensagem.</span>
      </h2>
      <p className="mt-4 text-fortuno-black/65 text-[15px] md:text-[16px] max-w-lg mx-auto">
        Prefere deixar registrado por aqui? Conte com uma resposta por e-mail em até 1 dia útil.
      </p>
    </div>

    <form
      className="relative bg-[linear-gradient(180deg,#ffffff_0%,#fbf7ef_100%)] border border-fortuno-gold-intense/28 rounded-[22px] shadow-paper overflow-hidden p-8 md:p-12
                 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[image:var(--card-gold-bar)] before:opacity-90
                 after:content-[''] after:absolute after:inset-3 after:border after:border-fortuno-gold-intense/10 after:rounded-[14px] after:pointer-events-none"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="form-title"
    >
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <Field name="name"    label="Nome completo" required autoComplete="name"  placeholder="Como podemos te chamar?" />
        <Field name="email"   label="E-mail"        required type="email" autoComplete="email" placeholder="seu.melhor@email.com" helpText="Usaremos este e-mail para responder." />
        <Field name="phone"   label="Telefone (opcional)" type="tel" autoComplete="tel" placeholder="(11) 99999-9999" inputMode="tel" />
        <SelectField name="subject" label="Assunto" required>
          <option value="" disabled>Selecione um assunto</option>
          <option value="duvida">Dúvida geral</option>
          <option value="suporte">Suporte</option>
          <option value="parceria">Parceria</option>
          <option value="sugestao">Sugestão</option>
          <option value="outro">Outro</option>
        </SelectField>
        <TextareaField name="message" label="Mensagem" required rows={4}
          placeholder="Descreva sua dúvida, sugestão ou solicitação."
          helpText="Mínimo 10 caracteres. Detalhes ajudam a respondermos com precisão."
          className="md:col-span-2"
        />

        {/* LGPD checkbox */}
        <label htmlFor="contact-consent" className="md:col-span-2 flex items-start gap-3 p-3.5
          bg-fortuno-gold-intense/[0.06] border border-dashed border-fortuno-gold-intense/32 rounded-[10px] cursor-pointer">
          <input
            type="checkbox"
            id="contact-consent"
            name="consent"
            required
            aria-required="true"
            className="appearance-none w-5 h-5 mt-0.5 shrink-0 bg-white border-[1.5px] border-fortuno-gold-intense/55 rounded-[5px] cursor-pointer relative
                       transition-[border-color,background] hover:border-fortuno-gold-intense
                       checked:bg-gradient-to-b checked:from-[#f0d27a] checked:via-[#c79b41] checked:to-[#8a6a25] checked:border-fortuno-gold-intense
                       checked:after:content-[''] checked:after:absolute checked:after:left-[5px] checked:after:top-0.5
                       checked:after:w-[6px] checked:after:h-[10px] checked:after:border-solid checked:after:border-fortuno-black
                       checked:after:border-r-2 checked:after:border-b-2 checked:after:rotate-45
                       focus-visible:outline-none focus-visible:shadow-input-focus"
          />
          <span className="text-[13.5px] leading-[1.55] text-fortuno-black/75">
            Li e concordo com a{' '}
            <Link to="/politica-de-privacidade" className="text-fortuno-gold-intense underline underline-offset-2 font-semibold hover:text-[#8a6a25]">
              Política de Privacidade
            </Link>
            {' '}e autorizo o uso dos meus dados para resposta desta mensagem.
          </span>
        </label>

        {/* Submit */}
        <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
          <p className="text-[12px] uppercase tracking-[0.22em] text-fortuno-black/50">
            Resposta por e-mail em até 1 dia útil.
          </p>
          <button type="submit" className="cta-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-[18px] h-[18px] animate-spin" aria-hidden="true" />
                Enviando…
              </>
            ) : (
              <>
                <Send className="w-[18px] h-[18px]" aria-hidden="true" />
                Enviar mensagem
                <ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>

  </div>
</section>
```

**Tipos**:

```ts
interface ContactFormValues {
  name: string;
  email: string;
  phone?: string;
  subject: 'duvida' | 'suporte' | 'parceria' | 'sugestao' | 'outro';
  message: string;
  consent: boolean;
}

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';
```

**Validação** (client-side, no submit):
- `name`: `trim().length >= 2`.
- `email`: regex padrão (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
- `phone`: opcional, aceita qualquer formato.
- `subject`: obrigatório (não vazio).
- `message`: `trim().length >= 10`.
- `consent`: deve ser `true`.

Erros inline abaixo de cada campo (`<p role="alert" className="mt-1.5 text-xs text-red-700">`),
com `aria-invalid="true"` no input e `aria-describedby` apontando
para o `<p>` do erro.

**Submit flow** (MOCK — registrar em MOCKS.md):

```ts
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!validate(values)) return;

  setState('submitting');

  // MOCK: aguarda endpoint POST /contact/messages
  await new Promise((r) => setTimeout(r, 1200));

  // Em produção (quando endpoint existir):
  // const res = await fetch('/api/contact/messages', {
  //   method: 'POST',
  //   headers: getHeaders(), // injeta X-Tenant-Id: fortuno + Bearer
  //   body: JSON.stringify(values),
  // });

  const ok = Math.random() > 0.1;   // simula 10% de falha; em produção: res.ok
  if (ok) {
    setState('success');
    toast.success('Mensagem enviada! Responderemos em até 1 dia útil.');
    reset();
  } else {
    setState('error');
    toast.error('Não foi possível enviar. Tente novamente ou use o WhatsApp.');
  }
};
```

Toast via `sonner` (já disponível no projeto, conforme `package.json`).
Após sucesso, limpar o formulário. Após erro, manter valores para
retry. Botão `disabled` enquanto `state === 'submitting'`.

### 2.4 `<ContactInstitutionalCard />`

Card claro com borda dupla ornamental + cantos art-déco. Paralelo
visual ao `FraudCertificate`, mas em corpo claro.

```tsx
<section className="relative z-10 py-16 md:py-20" aria-labelledby="institutional-title">
  <div className="mx-auto max-w-5xl px-6">
    <div className="relative bg-white border border-[color:var(--inst-border-outer)] rounded-[22px] p-11 overflow-hidden
                    before:content-[''] before:absolute before:inset-3.5 before:border before:border-[color:var(--inst-border-inner)] before:rounded-[14px] before:pointer-events-none
                    after:content-[''] after:absolute after:inset-0 after:bg-[image:var(--inst-halo)] after:pointer-events-none">

      {/* Cantos art-déco */}
      <span className="inst-deco-corner tl" aria-hidden="true" />
      <span className="inst-deco-corner tr" aria-hidden="true" />
      <span className="inst-deco-corner bl" aria-hidden="true" />
      <span className="inst-deco-corner br" aria-hidden="true" />

      <div className="relative z-10 text-center">
        <Eyebrow label="Dados oficiais" centered />
        <h2
          id="institutional-title"
          className="font-display italic mt-3 text-fortuno-black"
          style={{ fontSize: 'clamp(24px, 3vw, 34px)', letterSpacing: '-0.02em' }}
        >
          Fortuno — registro e atendimento.
        </h2>
        <Divider />  {/* ruler + diamante ouro */}
      </div>

      <dl className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        <InstItem icon={Building2} label="Razão social" value="FORTUNO SORTEIOS E PREMIAÇÕES LTDA" />
        <InstItem icon={Scale}     label="CNPJ"         value="00.000.000/0001-00" />
        <InstItem icon={Clock4}    label="Horário de atendimento" value="Seg. a sex., 9h às 18h (horário de Brasília)" />
        <InstItem icon={MapPin}    label="Endereço"     value="A definir" />
      </dl>

      <div className="relative z-10 mt-8 pt-6 border-t border-fortuno-gold-intense/20 text-center">
        <p className="text-[12px] uppercase tracking-[0.28em] text-fortuno-black/50">
          Aos finais de semana, retornamos no próximo dia útil.
        </p>
      </div>
    </div>
  </div>
</section>
```

Os 4 cantos `inst-deco-corner` são pseudo-elements no CSS (ver
`mockup.html` seção 4), com classes `.tl/.tr/.bl/.br` definindo as
bordas abertas. Reuso de padrão do `FraudCertificate`.

**Env vars opcionais** (com fallback):
- `VITE_COMPANY_NAME` → `FORTUNO SORTEIOS E PREMIAÇÕES LTDA` (fallback).
- `VITE_COMPANY_CNPJ` → `00.000.000/0001-00` (fallback).
- `VITE_COMPANY_ADDRESS` → `A definir` (fallback).
- `VITE_COMPANY_BUSINESS_HOURS` → `Seg. a sex., 9h às 18h (horário de Brasília)` (fallback).

Se nenhuma delas estiver configurada, usar os valores fallback (já
presentes no `FraudCertificate`). Documentar no arquivo de variáveis de
ambiente se optar por externalizar.

### 2.5 `<ContactFaq />`

Acordeão nativo `<details>`/`<summary>` — acessível por padrão, sem
dependências. **Não usar Radix Accordion aqui**: a semântica nativa
basta, reduz bundle, funciona sem JS.

```tsx
<section className="relative z-10 py-16 md:py-20" aria-labelledby="faq-title">
  <div className="mx-auto max-w-3xl px-6">

    <div className="text-center mb-10 md:mb-12">
      <Eyebrow chapter="III" label="Antes de mandar" centered />
      <h2
        id="faq-title"
        className="font-display mt-4 text-fortuno-black leading-[1.05]"
        style={{ fontSize: 'clamp(28px, 3.6vw, 40px)', letterSpacing: '-0.02em' }}
      >
        Talvez já tenha a <span className="italic text-fortuno-gold-intense">resposta.</span>
      </h2>
      <p className="mt-4 text-fortuno-black/65 text-[15px]">
        Dúvidas mais comuns dos participantes Fortuno. Se a sua não estiver aqui, use os canais acima.
      </p>
    </div>

    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <details
          key={faq.id}
          className="group bg-white border border-[color:var(--faq-border)] rounded-[14px] overflow-hidden
                     transition-[border-color,box-shadow]
                     hover:border-fortuno-gold-intense/55
                     open:border-fortuno-gold-intense/55 open:bg-white open:shadow-faq-open"
          open={i === 0}
        >
          <summary className="flex items-center justify-between gap-4 px-5.5 py-4.5 cursor-pointer list-none
                              font-semibold text-[15px] text-fortuno-black select-none
                              hover:text-fortuno-gold-intense
                              focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_3px_rgba(212,175,55,0.55)]
                              [&::-webkit-details-marker]:hidden">
            <span className="font-sans leading-[1.4] tracking-[-0.005em]">{faq.question}</span>
            <span className="grid place-items-center w-8 h-8 rounded-full
                             bg-fortuno-gold-intense/[0.08] border border-fortuno-gold-intense/32
                             text-fortuno-gold-intense shrink-0
                             transition-[transform,background]
                             group-open:rotate-180 group-open:bg-fortuno-gold-intense/[0.18]"
                  aria-hidden="true">
              <ChevronDown className="w-4 h-4" />
            </span>
          </summary>
          <div className="px-5.5 pb-5 pt-4 text-[14.5px] leading-[1.7] text-fortuno-black/72
                          border-t border-fortuno-gold-intense/18">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>

  </div>
</section>
```

**Copy oficial dos FAQs** (4 itens):

```ts
const faqs = [
  {
    id: 'premio',
    question: 'Como recebo meu prêmio?',
    answer: 'O prêmio é transferido via PIX diretamente para a conta do CPF registrado no bilhete em até 3 dias úteis após a ata pública do sorteio. Nenhum valor é solicitado do ganhador: não pagamos taxas, impostos ou qualquer tipo de antecipação. Todo o contato é feito exclusivamente pelos canais oficiais (WhatsApp e e-mail cadastrados no perfil) e, em casos específicos, por videochamada registrada.',
  },
  {
    id: 'pagamento',
    question: 'Quanto tempo demora a confirmação do pagamento?',
    answer: 'O PIX é confirmado em segundos. O bilhete é atribuído automaticamente ao seu CPF assim que a instituição financeira autorizada (Mercado Pago, Efí ou Gerencianet) devolve o webhook de pagamento. Se após 2 minutos o bilhete não aparecer em "Meus números", basta atualizar a página — se persistir, abra o WhatsApp informando o código do QR Code.',
  },
  {
    id: 'cancelar',
    question: 'Posso cancelar um bilhete após a compra?',
    answer: 'O cancelamento é possível em até 7 dias corridos após a compra, conforme o Código de Defesa do Consumidor, desde que o sorteio ainda não tenha sido realizado. O valor pago é devolvido pelo mesmo meio (PIX), descontadas eventuais taxas da instituição de pagamento. Cancelamentos após o sorteio não são possíveis.',
  },
  {
    id: 'sorteado',
    question: 'Como saber se fui sorteado?',
    answer: 'Você é notificado por e-mail e WhatsApp assim que a ata pública é publicada. O resultado também aparece na sua área logada em "Meus números", com o hash verificável do sorteio. Nunca enviamos links de "confirmação de premiação" por SMS ou chamadas de voz — qualquer contato fora dos canais oficiais é suspeito e deve ser ignorado.',
  },
];
```

Primeiro item vem expandido (`open` no primeiro `<details>`) para dar
um preview imediato do conteúdo — isso também ajuda a indicar
"visualmente" que é um acordeão, não apenas cards estáticos.

### 2.6 `<ContactClosingCta />`

Reuso integral do padrão `AboutClosingCta` com `compact: true`. Copy:

- Eyebrow: `Ainda em dúvida?`
- Title: `Nossa equipe está a um clique de distância.` (quebra opcional
  desktop antes de "a um clique"; "a um clique de distância." em ouro soft)
- Subtitle: `O WhatsApp é o caminho mais rápido. Resposta em média em menos de 4 horas úteis.`
- Primary CTA: `Abrir WhatsApp` → `VITE_WHATSAPP_URL` (external, ícone `MessageCircle` + `ArrowUpRight`)
- Secondary CTA: `Enviar mensagem` → `#mensagem` (scroll âncora, ícone `PenLine`)
- Signature: `Sua sorte é séria.` (reuso)

---

## 3. Componentes novos — checklist

- [ ] `src/components/contact/ContactHero.tsx`
- [ ] `src/components/contact/ContactChannelsGrid.tsx`
- [ ] `src/components/contact/ContactChannelCard.tsx`
- [ ] `src/components/contact/ContactForm.tsx`
- [ ] `src/components/contact/ContactInstitutionalCard.tsx`
- [ ] `src/components/contact/ContactFaq.tsx`
- [ ] `src/components/contact/ContactClosingCta.tsx` (ou refactor shared)

Helpers opcionais (reuso entre contact e about):
- [ ] `src/components/shared/Eyebrow.tsx` — `{ chapter?: string; label: string; centered?: boolean }`

---

## 4. Strings em pt-BR (consolidado)

| Bloco                 | String                                                                                                                    |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------|
| Hero eyebrow          | `Fortuno · Canais oficiais`                                                                                               |
| Hero title            | `Estamos por perto.`                                                                                                      |
| Hero subtitle         | `Escolha o canal que preferir. Respondemos em até 1 dia útil — e, no WhatsApp, geralmente em menos de 4 horas.`          |
| Hero trust 1          | `Seg. a sex., 9h às 18h`                                                                                                  |
| Hero trust 2          | `Brasil · Fuso BRT`                                                                                                       |
| Hero trust 3          | `LGPD · dados protegidos`                                                                                                 |
| Channels eyebrow      | `Capítulo I · Canais`                                                                                                     |
| Channels title        | `Escolha como prefere conversar.`                                                                                         |
| Form eyebrow          | `Capítulo II · Mensagem`                                                                                                  |
| Form title            | `Envie sua mensagem.`                                                                                                     |
| Form subtitle         | `Prefere deixar registrado por aqui? Conte com uma resposta por e-mail em até 1 dia útil.`                               |
| Form disclaimer       | `Resposta por e-mail em até 1 dia útil.`                                                                                  |
| Form submit           | `Enviar mensagem`                                                                                                         |
| Form submit loading   | `Enviando…`                                                                                                               |
| Form LGPD             | `Li e concordo com a Política de Privacidade e autorizo o uso dos meus dados para resposta desta mensagem.`              |
| Form toast success    | `Mensagem enviada! Responderemos em até 1 dia útil.`                                                                      |
| Form toast error      | `Não foi possível enviar. Tente novamente ou use o WhatsApp.`                                                             |
| Inst eyebrow          | `Dados oficiais`                                                                                                          |
| Inst title            | `Fortuno — registro e atendimento.`                                                                                       |
| Inst disclaimer       | `Aos finais de semana, retornamos no próximo dia útil.`                                                                   |
| FAQ eyebrow           | `Capítulo III · Antes de mandar`                                                                                          |
| FAQ title             | `Talvez já tenha a resposta.`                                                                                             |
| FAQ subtitle          | `Dúvidas mais comuns dos participantes Fortuno. Se a sua não estiver aqui, use os canais acima.`                         |
| Closing eyebrow       | `Ainda em dúvida?`                                                                                                        |
| Closing title         | `Nossa equipe está a um clique de distância.`                                                                             |
| Closing subtitle      | `O WhatsApp é o caminho mais rápido. Resposta em média em menos de 4 horas úteis.`                                        |
| Closing primary       | `Abrir WhatsApp`                                                                                                          |
| Closing secondary     | `Enviar mensagem`                                                                                                         |
| Closing signature     | `Sua sorte é séria.`                                                                                                      |

---

## 5. Env vars consumidas

Já existentes:
- `VITE_WHATSAPP_URL` — URL do WhatsApp (ex.: `https://wa.me/5511999999999`). Se vazia, o card WhatsApp não renderiza.
- `VITE_INSTAGRAM_URL` — URL pública do perfil (ex.: `https://instagram.com/fortuno`). Se vazia, o card Instagram não renderiza.
- `VITE_CONTACT_EMAIL` — e-mail de contato (ex.: `contato@fortuno.com.br`). Renderiza `mailto:` + label. Se vazia, o card E-mail não renderiza.

Novas (opcionais, com fallback):
- `VITE_COMPANY_NAME` → fallback: `FORTUNO SORTEIOS E PREMIAÇÕES LTDA`.
- `VITE_COMPANY_CNPJ` → fallback: `00.000.000/0001-00`.
- `VITE_COMPANY_ADDRESS` → fallback: `A definir`.
- `VITE_COMPANY_BUSINESS_HOURS` → fallback: `Seg. a sex., 9h às 18h (horário de Brasília)`.

Se o `frontend-react-developer` preferir hard-codar esses valores (já
aparecem idênticos no `FraudCertificate`), seguir com o mesmo critério
usado naquele componente. Recomendação: extrair para
`src/constants/company.ts` com os valores e permitir override por env.

---

## 6. Mocks — registro obrigatório

Adicionar ao `MOCKS.md` na raiz:

```markdown
### ContactForm — envio de mensagens

- **Arquivo**: `src/components/contact/ContactForm.tsx`
- **Rota esperada**: `POST /contact/messages` (ou `POST /v1/contact` — a definir com o backend)
- **Payload**:
  ```json
  {
    "name": "string",
    "email": "string (email)",
    "phone": "string | null",
    "subject": "duvida | suporte | parceria | sugestao | outro",
    "message": "string (>= 10 chars)",
    "consent": true
  }
  ```
- **Response esperado**: `201 Created` com `{ "id": "uuid", "createdAt": "ISO-8601" }`.
- **Descrição**: formulário público de contato. Enquanto o endpoint não existir, usa `setTimeout(1200ms)` com 10% de falha simulada para validar estados loading/success/error. Toast via sonner (success: "Mensagem enviada! …", error: "Não foi possível enviar. …"). Após sucesso, reset do formulário.
- **Bruno collection**: falta entry em `c:/repos/Fortuno/Fortuno/bruno` — adicionar quando endpoint for definido.
- **Item de acompanhamento**: pendente de issue.
```

O código do service **não precisa** passar por `apiHelpers.getHeaders()`
enquanto for mock. Quando for integrar, criar
`src/Services/contactService.ts` com `submitContactMessage(payload)`
que usa `getHeaders()` (injeta `X-Tenant-Id: fortuno` + Bearer token
NAuth conforme SC-004) e consome a rota real.

---

## 7. Integração com `sonner` (já instalado)

O projeto já tem `sonner@^1.7.0` no `package.json`. Espera-se que o
`<Toaster />` já esteja renderizado no `AuthenticatedShell` ou em
`App.tsx`. Consumir no form:

```ts
import { toast } from 'sonner';

toast.success('Mensagem enviada! Responderemos em até 1 dia útil.');
toast.error('Não foi possível enviar. Tente novamente ou use o WhatsApp.');
```

Se o `<Toaster />` ainda não estiver montado, **adicionar** em
`App.tsx` com `<Toaster position="top-right" richColors closeButton />`
— isso é pré-requisito e deve ser feito antes do merge desta feature.

---

## 8. Responsivo — breakpoints

| Breakpoint     | Hero                                          | Canais           | Form                     | Inst. card        | FAQ            | Closing         |
|----------------|-----------------------------------------------|------------------|--------------------------|-------------------|----------------|-----------------|
| `< 768px`      | Stack (glyph acima do texto, max-w-260px)     | 1 coluna         | 1 coluna (todos fields)  | 1 coluna          | full width     | stack botões    |
| `768-1024px`   | 2 cols [1.4fr_0.8fr]                          | 3 colunas        | 2 colunas (exceto msg)   | 2 colunas         | max-w-3xl      | row CTAs        |
| `>= 1024px`    | idem                                          | idem             | idem                     | idem              | idem           | idem            |

Grids não precisam de `auto-fit` — número de cards é fixo (3 canais
com filtro, 4 FAQs, 4 dados institucionais).

---

## 9. Reduced motion

Herda o bloco global:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition-duration: 1ms !important;
  }
}
```

Comportamento por componente:
- **Channel card**: hover lift (`translateY(-4px)`) suprimido. Estado
  final (border-color, shadow) ainda é alcançável via focus-visible.
- **FAQ chevron**: rotação de 180deg suprimida. O `<details>` continua
  funcional (open/close sem animação).
- **Submit spinner**: `animate-spin` do Lucide `Loader2` — pode manter
  (é a única forma de indicar progresso visualmente). Alternativa
  acessível: ocultar ícone e mostrar texto "Enviando…" apenas (padrão
  recomendado). **Decisão**: manter `Loader2 className="animate-spin"`
  + texto — a regra global reduz a 1ms mas mantém o spinner acessível.
  Ou forçar `motion-reduce:hidden` no Loader2 e usar só o texto.

---

## 10. Accessibility checks finais

- [ ] H1 único por página (`#contact-hero-title`).
- [ ] Landmarks: `<main>` (no shell), `<section aria-labelledby>` em cada bloco, `<footer>` (no shell), `<nav>` no header (já presente).
- [ ] `<dl>` com `<dt>`/`<dd>` no institutional card (semântica de "lista de definições").
- [ ] Campos do form: `<label for>` explícito, `required` + `aria-required`, erros com `role="alert"` + `aria-describedby`, `autocomplete` apropriado.
- [ ] Checkbox LGPD: label clicável, focus ring ouro (3:1+).
- [ ] Links externos (WhatsApp/Instagram): `target="_blank"` + `rel="noopener noreferrer"` + ícone `ArrowUpRight` (indicador visual de "sai do site") + `aria-label` descritivo.
- [ ] Ícones decorativos: `aria-hidden="true"` (Lucide aceita prop implícita via role="img" ausente).
- [ ] Acordeão nativo `<details>`: estado anunciado por SR automaticamente; chevron é `aria-hidden`.
- [ ] Focus visible em TODOS os interativos: cards (`a`), inputs, textarea, select, checkbox, submit, summary do FAQ, CTAs — ring ouro 3px.
- [ ] Contraste: ver tabela em `tokens.md` §5 — todos os textos passam AA.
- [ ] Skip link (se existe globalmente) continua funcional nesta página.

---

## 11. Estimativa de densidade da página

Desktop (≥1024px), viewport 1440×900:

| Seção                    | Altura aprox. |
|--------------------------|---------------|
| Topbar (shell)           | 64px          |
| Hero                     | 440px         |
| Canais                   | 420px         |
| Formulário               | 720px         |
| Inst. card               | 400px         |
| FAQ (4 itens, 1 aberto)  | 520px         |
| Closing CTA              | 400px         |
| Footer (shell)           | 180px         |
| **Total**                | **~3144px**   |

Comparado à `/quem-somos` (~4800px) e `/` (~5200px), a contact é
**35% mais compacta** — adequado ao objetivo "clareza e resposta
rápida".

---

## 12. Referências cruzadas

- Wizard:     `design/wizard-vertical/tokens.md`, `design/wizard-vertical/spec.md`
- Home:       `design/home/mockup.html`, `design/home/tokens.md`
- Dashboard:  `design/dashboard/tokens.md`
- About:      `design/about/mockup.html`, `design/about/spec.md`, `design/about/tokens.md`
- Mockup:     `design/contact/mockup.html`
- Tokens:     `design/contact/tokens.md`
- Arquivo atual a substituir: `src/pages/public/ContactPage.tsx`
