# Handoff — `/quem-somos` (AboutPage) · Editorial Casino Noir

Documento de implementação para `frontend-react-developer`. Gera o redesign
completo da `AboutPage` (arquivo atual: `src/pages/public/AboutPage.tsx`) como
página institucional da marca.

Dependências de design já aprovadas:

- `design/wizard-vertical/` — tokens base
- `design/home/` — fornece `FraudCertificate`, `StatsBand`, `SecurityPillars`, `HowItWorksTimeline`, `ClosingCTA`
- `design/dashboard/` — fornece variante LIGHT BODY (body claro, paper cards, shadows)
- `design/about/tokens.md` — apenas 3 tokens novos: drop cap, quote ornamental, timeline horizontal light

Mockup de referência: `design/about/mockup.html` (preview standalone).

---

## 1. Árvore de componentes

```
<AuthenticatedShell>  (já existe — provê Header + Footer globais)
 └── <AboutPage>
      ├── <AboutHero />                     [NOVO]
      ├── <InstitutionalStatsBand />        [REFATOR de StatsBand da home]
      ├── <MissionEditorial />              [NOVO]
      ├── <ValuesPillars />                 [REFATOR de SecurityPillars da home]
      ├── <HowWeWorkTimeline />             [REFATOR de HowItWorksTimeline da home]
      ├── <FraudCertificate />              [REUSO IDÊNTICO — import da home]
      └── <AboutClosingCta />               [NOVO — variante do FinalCTA da home]
```

### Recomendação de refatoração compartilhada

Três componentes da home devem ser **elevados a componentes compartilhados** com props para variação institucional × operacional:

| Home hoje                 | Compartilhado (proposto)           | Diferença controlada por props                                         |
|---------------------------|------------------------------------|------------------------------------------------------------------------|
| `StatsBand` (dark)        | `StatsBand` com prop `variant`     | `variant: 'dark' \| 'light'` — muda background, cor de label e divisor |
| `SecurityPillars` (dark)  | `Pillars` com prop `variant`       | `variant: 'dark' \| 'light'` — muda surface (glass vs paper) e texto   |
| `HowItWorksTimeline` (dark) | `StepsTimeline` com prop `variant` | `variant: 'dark' \| 'light'` — muda cor dos markers e do rail          |
| `FraudCertificate`        | (já genérico)                      | Nenhuma mudança — reuso idêntico                                       |
| `FinalCTA` (home)         | `ClosingCta` com prop `copy`       | Copy institucional vs operacional; layout idêntico                     |

**Caminho sugerido**: mover os 3 componentes refatorados para
`src/components/shared/` consumidos tanto por `HomePage` quanto por `AboutPage`.

---

## 2. DOM por seção (Tailwind exato)

Todos os blocos assumem o shell externo:

```tsx
<main className="bg-[color:var(--dash-bg-page)] text-fortuno-black min-h-screen">
  {/* ...seções */}
</main>
```

### 2.1 `<AboutHero />`

```tsx
<section
  className="relative bg-about-hero-halo pt-16 md:pt-24 pb-16 md:pb-24
             before:absolute before:top-0 before:left-[10%] before:right-[10%] before:h-px before:bg-[image:var(--gold-divider)]
             after:absolute  after:bottom-0 after:left-[20%]  after:right-[20%] after:h-px after:bg-[image:var(--gold-divider-soft)]"
  aria-labelledby="about-hero-title"
>
  <div className="mx-auto max-w-7xl px-6">
    <div className="grid md:grid-cols-[1.35fr_1fr] gap-10 lg:gap-16 items-center">

      {/* Coluna texto */}
      <div className="relative">
        <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold">
          <span className="inline-block w-8 h-px bg-fortuno-gold-intense/70" />
          Fortuno · Desde 2025
          <span className="inline-block w-8 h-px bg-fortuno-gold-intense/70" />
        </span>

        <h1 id="about-hero-title"
            className="font-display mt-6 md:mt-8 text-fortuno-black leading-[1.02]
                       text-[clamp(40px,6vw,72px)] tracking-[-0.02em]">
          A sorte ganha confiança <br className="hidden md:block" />
          <em className="italic text-fortuno-gold-intense">quando é organizada.</em>
        </h1>

        <p className="mt-6 md:mt-7 text-[17px] md:text-[18px] leading-relaxed text-fortuno-black/72 max-w-xl">
          Plataforma brasileira de sorteios auditáveis — cada bilhete tem rastro,
          cada prêmio tem entrega, cada participante sabe exatamente o que comprou.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link to="/sorteios" className="cta-primary">
            <Ticket /> Ver sorteios em andamento <ArrowRight />
          </Link>
          <a href="#missao" className="cta-ghost cta-ghost-light">
            Conheça nossa história <ArrowDown />
          </a>
        </div>

        {/* Mini trust bar */}
        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-fortuno-black/55">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-fortuno-gold-intense" aria-hidden="true" />
            Auditoria externa
          </span>
          {/* ...separadores · demais trust items */}
        </div>
      </div>

      {/* Coluna arte: SVG do cofre */}
      <figure className="hero-art order-first md:order-last" aria-hidden="true">
        <SafeVaultArtDeco />  {/* SVG inline — ver mockup.html linha ~600 */}
      </figure>
    </div>
  </div>
</section>
```

Props do componente: nenhuma (conteúdo fixo). A imagem pode ser parametrizada mais tarde via `artVariant`.

### 2.2 `<InstitutionalStatsBand />`

Reuso do `StatsBand` compartilhado com `variant="light"`. Props sugeridas:

```ts
interface StatsBandProps {
  variant: 'dark' | 'light';
  stats: Array<{
    value: number;        // target numérico (count-up)
    suffix?: string;      // ex.: '%' ou 'k+'
    prefix?: string;      // ex.: 'R$ '
    label: string;        // ex.: 'Ano de fundação'
    srValue?: string;     // valor lido por screen readers
  }>;
}
```

Conteúdo institucional (4 stats):

```ts
const aboutStats = [
  { value: 2025,  label: 'Ano de fundação',       srValue: '2025' },
  { value: 12400, prefix: 'R$ ', suffix: 'k+',    label: 'Distribuídos em prêmios', srValue: '12.400.000 reais' },
  { value: 48,    label: 'Sorteios realizados',   srValue: '48' },
  { value: 15320, suffix: '+',    label: 'Ganhadores atendidos', srValue: '15.320' },
];
```

### 2.3 `<MissionEditorial />`

Layout 2 colunas editorial:

```tsx
<section id="missao" className="relative py-20 md:py-28" aria-labelledby="mission-title">
  <div className="mx-auto max-w-7xl px-6">
    <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">

      {/* Coluna esquerda: título editorial sticky */}
      <div className="md:sticky md:top-24">
        <span className="eyebrow">
          <span className="rule" />
          Capítulo I
        </span>
        <h2 id="mission-title"
            className="font-display mt-5 text-fortuno-black leading-[1.0]
                       text-[clamp(44px,5.4vw,68px)] tracking-[-0.02em]">
          Nossa <br />
          <em className="italic text-fortuno-gold-intense">missão.</em>
        </h2>
        <div className="flex items-center gap-3.5 mt-[18px]">
          <span className="flex-none w-12 h-px bg-fortuno-gold-intense/80" />
          <span className="w-2 h-2 rotate-45 bg-fortuno-gold-intense shadow-[0_0_10px_rgba(184,150,63,0.55)]" />
        </div>
        <p className="mt-5 text-[13px] uppercase tracking-[0.22em] text-fortuno-black/50 font-semibold">
          Transparência e entrega, em cada bilhete.
        </p>
      </div>

      {/* Coluna direita: corpo editorial */}
      <div className="mission-body">
        <p className="dropcap">O Fortuno nasceu em 2025 …</p>

        <blockquote className="mission-quote">
          A sorte deixa de ser loteria quando cada número tem dono, cada sorteio
          tem testemunha e cada prêmio tem contrato.
          <cite>— Manifesto Fortuno, 2025</cite>
        </blockquote>

        <p>Construímos cada sorteio …</p>
        <p>Cada edição do Fortuno é publicada com …</p>
      </div>
    </div>
  </div>
</section>
```

**Drop cap implementation**: usar CSS `::first-letter` (ver `tokens.md §4`). Como Tailwind suporta `first-letter:`, a classe pode ficar inline no `<p>`. **Não** usar `<span>` wrapper — a `::first-letter` preserva a semântica.

### 2.4 `<ValuesPillars />`

Reuso do `Pillars` compartilhado com `variant="light"`. Props:

```ts
interface PillarsProps {
  variant: 'dark' | 'light';
  eyebrow: string;
  title: React.ReactNode;    // suporta JSX para <em>
  subtitle?: string;
  columns?: 3 | 4;
  items: Array<{
    iconName: keyof typeof import('lucide-react');  // ex.: 'Eye'
    title: string;
    description: string;
    footnoteIcon?: keyof typeof import('lucide-react');
    footnoteText?: string;
    ordinal?: string;   // 'I', 'II', 'III', 'IV'
  }>;
}
```

Conteúdo institucional (4 valores):

```ts
const aboutValues = {
  eyebrow: 'Capítulo II',
  title: <>Nossos <em className="italic text-fortuno-gold-intense">valores.</em></>,
  subtitle: 'Quatro princípios que guiam cada decisão técnica, cada copy, cada parceria. Não são frases — são restrições de projeto.',
  columns: 4,
  items: [
    { ordinal: 'I',   iconName: 'Eye',            title: 'Transparência', description: 'Cada sorteio publica ata, hash verificável e lista completa de bilhetes. Resultados disponíveis em tempo real, para sempre.', footnoteIcon: 'FileCheck2',     footnoteText: 'Auditoria pública' },
    { ordinal: 'II',  iconName: 'BadgeCheck',     title: 'Confiança',      description: 'Pagamentos processados por instituições reguladas, LGPD por padrão e zero compartilhamento de dados pessoais com terceiros.', footnoteIcon: 'Lock',          footnoteText: 'TLS 1.3 · AES-256' },
    { ordinal: 'III', iconName: 'Sparkles',       title: 'Experiência',    description: 'Interface editorial, sem poluição visual. Participar leva menos de dois minutos — do primeiro clique ao PIX confirmado.',         footnoteIcon: 'Zap',           footnoteText: '< 2min para participar' },
    { ordinal: 'IV',  iconName: 'ClipboardCheck', title: 'Auditoria',      description: 'Resultado reprodutível por qualquer participante. Hash público, método documentado, sem caixas-pretas.',                          footnoteIcon: 'ShieldCheck',   footnoteText: 'Ata pública por edição' },
  ],
};
```

Grid desktop: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6`.

### 2.5 `<HowWeWorkTimeline />`

Reuso do `StepsTimeline` compartilhado com `variant="light"`. Props:

```ts
interface StepsTimelineProps {
  variant: 'dark' | 'light';
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  steps: Array<{
    ordinal: string;          // '01', '02', ...
    iconName: keyof typeof import('lucide-react');
    chipLabel: string;
    title: string;
    description: string;
  }>;
}
```

Conteúdo institucional (4 passos):

```ts
const aboutHow = {
  eyebrow: 'Capítulo III',
  title: <>Como <em className="italic text-fortuno-gold-intense">funcionamos.</em></>,
  subtitle: 'Quatro etapas mapeadas, rastreáveis e auditáveis. Do cadastro do sorteio à entrega do prêmio — tudo em registro público.',
  steps: [
    { ordinal: '01', iconName: 'Briefcase', chipLabel: 'Organizador', title: 'Cadastra o sorteio',                description: 'Organizador validado define prêmio, CNPJ e método de sorteio.' },
    { ordinal: '02', iconName: 'Ticket',    chipLabel: 'Bilhetes',    title: 'Disponibilizados ao público',        description: 'Edição publicada, numeração pública, limite de bilhetes declarado.' },
    { ordinal: '03', iconName: 'QrCode',    chipLabel: 'Pagamento',   title: 'PIX confirmado em segundos',         description: 'Pagamento via instituição regulada. Bilhete atribuído automaticamente.' },
    { ordinal: '04', iconName: 'Trophy',    chipLabel: 'Entrega',     title: 'Sorteio auditado e prêmio entregue', description: 'Hash público, ata registrada, prêmio transferido ao ganhador.' },
  ],
};
```

Implementação do rail:

- Desktop (`md+`): trilha horizontal única posicionada `top-14` sobre a linha dos markers, usando `bg-timeline-rail-light`.
- Mobile: rail some (`display: none`); cada step vira linha 2 colunas `grid-cols-[96px_1fr]` com o numeral Playfair à esquerda e texto à direita. Markers-dot escondidos (a numeração Playfair é o indicador visual primário).

Ver mockup linhas `.how-rail-light` + `.how-step` + media query mobile.

### 2.6 `<FraudCertificate />` (REUSO IDÊNTICO)

**Sem mudança**. Importar o componente já consolidado do home:

```tsx
import { FraudCertificate } from '@/components/shared/FraudCertificate';

<FraudCertificate />
```

Todo o DOM, copys, watermark, corners art-déco e selos são os mesmos da home.
Nenhuma prop institucional — é um selo oficial, idêntico em todas as páginas
onde aparece.

### 2.7 `<AboutClosingCta />`

Variante do `FinalCTA` da home com copy institucional. Props sugeridas (se
transformar em componente compartilhado `ClosingCta`):

```ts
interface ClosingCtaProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  primaryCta: { label: string; href: string; iconName: keyof typeof import('lucide-react') };
  secondaryCta: { label: string; href: string; iconName?: keyof typeof import('lucide-react') };
  signature?: string;  // default: 'Sua sorte é séria.'
}
```

Conteúdo:

```ts
const aboutClosing = {
  eyebrow: 'Epílogo',
  title: <>Pronto para entrar <br/><em className="text-fortuno-gold-soft italic">no jogo?</em></>,
  subtitle: 'Confira os sorteios em andamento e escolha a sua sorte. Cada bilhete tem rastro — inclusive o seu.',
  primaryCta:   { label: 'Ver sorteios',   href: '/sorteios',       iconName: 'Ticket' },
  secondaryCta: { label: 'Fale conosco',   href: '/fale-conosco',   iconName: 'MessageCircle' },
  signature: 'Sua sorte é séria.',
};
```

---

## 3. Responsividade (resumo)

| Breakpoint    | Hero                                           | Stats band                    | Missão                                      | Pilares                  | Timeline                                  | Closing CTA |
|---------------|-----------------------------------------------|-------------------------------|---------------------------------------------|--------------------------|-------------------------------------------|-------------|
| `< 640px`     | Stack vertical (arte acima do texto)           | `grid-cols-2` 2×2, sem divisores | Colunas viram 1: título → corpo             | `grid-cols-1`           | Vertical: numeral à esq. + texto à dir.   | Stack       |
| `≥ 640px`     | Idem mobile                                    | Idem (2×2)                    | Idem (1 col)                                | `grid-cols-2` 2×2        | Idem mobile                               | Idem        |
| `≥ 768px`     | Grid `[1.35fr_1fr]` lado a lado                | `grid-cols-4` + divisores     | Grid `[0.85fr_1.15fr]` com título sticky    | `grid-cols-2`           | `grid-cols-4` horizontal com rail         | Centrado    |
| `≥ 1024px`    | Idem (`max-w-7xl`)                             | Idem                          | `gap-lg:20`                                 | `grid-cols-4`           | Idem                                      | Idem        |

Container global: `mx-auto max-w-7xl px-6`.

---

## 4. Acessibilidade — checklist

- [ ] `<h1>` único por página — `#about-hero-title` na seção hero.
- [ ] Cada seção com `aria-labelledby` apontando para seu `<h2>`.
- [ ] Hierarquia: `h1` (hero) → `h2` (cada seção) → `h3` (cards/steps).
- [ ] Todos os ícones Lucide decorativos têm `aria-hidden="true"`.
- [ ] Ícones semânticos (ex.: chip de social no FraudCertificate) têm `aria-label`.
- [ ] SVG do cofre (hero art) com `aria-hidden="true"` no `<figure>` — é complemento decorativo ao `<h1>`.
- [ ] Drop cap via `::first-letter` preserva fluxo semântico; primeira palavra natural em pt-BR ("O Fortuno…").
- [ ] `<blockquote>` + `<cite>` na mission quote.
- [ ] `<ol aria-label="Etapas do fluxo Fortuno">` na timeline; cada step é `<li>` com `<h3>` próprio.
- [ ] Stats com `<span className="sr-only">` para valor final legível; count-up apenas visual.
- [ ] Focus ring dourado (`focus-visible:shadow-gold-focus` ou equivalente) em todos os CTAs, links do nav, pilares (tabindex=0 se cards clicáveis) e chips do FraudCertificate.
- [ ] Contraste mínimo 4.5:1 nos corpos de texto (`text-fortuno-black/68` e `/72` sobre `#f1ece3` ≥ 6:1).
- [ ] Touch targets ≥ 44×44px em todos os CTAs (hero, pilares, closing).

---

## 5. Reduced motion

- Count-up do stats band: pular direto ao valor final via `::after { content: '…' }` nas regras `@media (prefers-reduced-motion: reduce)` (já no mockup).
- Hover lift dos pilares: mantém estado final estático; `transition-duration: 1ms` herdado da regra global do `index.css`.
- Scroll reveal (se implementado via IntersectionObserver + classes CSS): desligar completamente sob reduced motion, renderizando o estado final diretamente.

---

## 6. Conteúdo pt-BR (strings finais)

**Hero**
- Eyebrow: `Fortuno · Desde 2025`
- H1: `A sorte ganha confiança quando é organizada.` (segunda linha em itálico ouro)
- Subhead: `Plataforma brasileira de sorteios auditáveis — cada bilhete tem rastro, cada prêmio tem entrega, cada participante sabe exatamente o que comprou.`
- CTA primário: `Ver sorteios em andamento` → `/sorteios`
- CTA ghost: `Conheça nossa história` → `#missao`

**Stats band** (valores mock; refletir dado real quando disponível)
- `2025` — Ano de fundação
- `R$ 12.400k+` — Distribuídos em prêmios
- `48` — Sorteios realizados
- `15.320+` — Ganhadores atendidos

**Missão (copy editorial)**
- Eyebrow: `Capítulo I`
- Título: `Nossa missão.`
- Lead (drop cap): `O Fortuno nasceu em 2025 para organizar algo que, no Brasil, sempre foi opaco: o universo dos sorteios online. Nossa plataforma registra cada bilhete com rastreabilidade completa — do clique inicial ao PIX confirmado, da ata pública do sorteio à entrega do prêmio ao ganhador. Cada etapa é auditável. Cada resultado, reprodutível.`
- Quote: `A sorte deixa de ser loteria quando cada número tem dono, cada sorteio tem testemunha e cada prêmio tem contrato.` — Manifesto Fortuno, 2025
- Parágrafo 2: `Construímos cada sorteio em parceria com organizadores que buscam profissionalismo, compradores que exigem previsibilidade, e reguladores que precisam de transparência. Nosso papel é intermediar — nunca especular. Nunca opacificar. Nunca surpreender.`
- Parágrafo 3: `Cada edição do Fortuno é publicada com: CNPJ do organizador, instituição de pagamento autorizada, método de sorteio (Loteria Federal ou geração auditada), lista completa de bilhetes vendidos e hash verificável do resultado. Você não precisa confiar em nós — confie nos números.`

**Valores** — ver bloco `aboutValues` em §2.4.

**Como funcionamos** — ver bloco `aboutHow` em §2.5.

**Closing CTA**
- Eyebrow: `Epílogo`
- H2: `Pronto para entrar no jogo?` (segunda linha ouro)
- Subhead: `Confira os sorteios em andamento e escolha a sua sorte. Cada bilhete tem rastro — inclusive o seu.`
- CTA primário: `Ver sorteios` → `/sorteios`
- CTA ghost: `Fale conosco` → `/fale-conosco`
- Assinatura: `Sua sorte é séria.`

---

## 7. Arquivos impactados na implementação

```
src/
├── pages/
│   └── public/
│       └── AboutPage.tsx           (REWRITE — compõe 7 componentes)
├── components/
│   └── shared/                     (NOVA pasta — recomendada)
│       ├── StatsBand.tsx           (refator: extrair de home, aceitar variant)
│       ├── Pillars.tsx             (refator: extrair SecurityPillars, aceitar variant)
│       ├── StepsTimeline.tsx       (refator: extrair HowItWorksTimeline, aceitar variant)
│       ├── ClosingCta.tsx          (refator: extrair FinalCTA da home, aceitar copy)
│       └── FraudCertificate.tsx    (mover sem mudança do módulo home)
│   └── about/                      (NOVA pasta)
│       ├── AboutHero.tsx           (novo)
│       ├── MissionEditorial.tsx    (novo)
│       └── VaultArtDeco.tsx        (SVG inline do hero)
└── styles/
    └── tokens.css                  (anexar bloco §2 de design/about/tokens.md)
tailwind.config.js                  (merge §3 de design/about/tokens.md)
```

Recomendação de ordem para o `frontend-react-developer`:

1. Refatorar os 4 componentes da home para `shared/` (antes de tocar em AboutPage).
2. Adicionar tokens novos em `tokens.css` e `tailwind.config.js`.
3. Criar os 3 componentes novos de about (`AboutHero`, `MissionEditorial`, `VaultArtDeco`).
4. Reescrever `AboutPage.tsx` compondo os 7 componentes na ordem definida em §1.
5. Smoke test em `/quem-somos` no desktop (1440px) e mobile (375px).
6. Validar reduced-motion + focus-ring + contraste.

---

## 8. Referências

- Mockup HTML standalone: `design/about/mockup.html`
- Tokens exclusivos: `design/about/tokens.md`
- Home (origem dos componentes reusados): `design/home/{mockup.html, spec.md, tokens.md}`
- Dashboard (origem da variante LIGHT): `design/dashboard/{mockup.html, spec.md, tokens.md}`
- Wizard (tokens base): `design/wizard-vertical/{mockup.html, spec.md, tokens.md}`
