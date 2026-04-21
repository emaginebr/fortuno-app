export const AboutPage = (): JSX.Element => (
  <main className="mx-auto max-w-4xl px-4 py-16">
    <header className="text-center">
      <img src="/logo-dark.png" alt="Fortuno" className="mx-auto h-16" />
      <h1 className="mt-6 font-display text-4xl text-fortuno-black">Quem Somos</h1>
      <p className="mt-3 text-fortuno-black/70">
        Sorteios transparentes, pagamentos instantâneos e a sua sorte em um clique.
      </p>
    </header>

    <section className="mt-12 space-y-6 text-fortuno-black/80">
      <h2 className="font-display text-2xl text-fortuno-gold-intense">Nossa missão</h2>
      <p>
        O Fortuno nasceu para oferecer uma experiência de sorteios online moderna, segura e
        totalmente auditável. Cada bilhete vendido é registrado com rastreabilidade completa — do
        pagamento PIX até a premiação final.
      </p>

      <h2 className="font-display text-2xl text-fortuno-gold-intense">Nossos valores</h2>
      <ul className="list-inside list-disc space-y-2">
        <li>
          <strong>Transparência:</strong> todo sorteio é auditado e os resultados são públicos.
        </li>
        <li>
          <strong>Confiança:</strong> seus dados nunca são compartilhados e o pagamento é
          processado por instituições reguladas.
        </li>
        <li>
          <strong>Experiência:</strong> uma plataforma que respeita o seu tempo e o seu dinheiro.
        </li>
      </ul>

      <h2 className="font-display text-2xl text-fortuno-gold-intense">Como funcionamos</h2>
      <p>
        Organizadores cadastram sorteios, compradores participam com bilhetes PIX e o Fortuno
        intermedia e audita cada etapa — garantindo que cada número vendido tenha um dono legítimo
        e que cada prêmio seja entregue.
      </p>
    </section>
  </main>
);
