import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLottery } from '@/hooks/useLottery';
import { useCheckout } from '@/hooks/useCheckout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { LotteryImageCarousel } from '@/components/lottery/LotteryImageCarousel';
import { MarkdownView } from '@/components/lottery/MarkdownView';
import { ComboSelector } from '@/components/lottery/ComboSelector';
import { RulesPdfButton } from '@/components/lottery/RulesPdfButton';
import { formatBRL } from '@/utils/currency';

export const LotteryDetailPage = (): JSX.Element => {
  const { slug } = useParams();
  const { currentLottery, loading, loadBySlug } = useLottery();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  useEffect(() => {
    if (slug) void loadBySlug(slug);
  }, [slug, loadBySlug]);

  if (loading || !currentLottery) {
    return <LoadingSpinner label="Carregando sorteio..." />;
  }

  const startCheckout = (): void => {
    checkout.setLotteryId(currentLottery.lotteryId);
    checkout.setQuantity(selectedQuantity);
    navigate(`/checkout/${currentLottery.lotteryId}`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <LotteryImageCarousel images={currentLottery.images ?? []} />
        </div>

        <div className="space-y-4">
          <h1 className="font-display text-4xl text-fortuno-black">{currentLottery.name}</h1>
          <p className="text-fortuno-black/70">
            Prêmio total:{' '}
            <strong className="text-fortuno-gold-intense">
              {formatBRL(currentLottery.totalPrizeValue)}
            </strong>
          </p>
          <p className="text-fortuno-black/70">
            Cada bilhete:{' '}
            <strong>{formatBRL(currentLottery.ticketPrice)}</strong>
          </p>
          <p className="text-sm text-fortuno-black/60">
            Mínimo {currentLottery.ticketMin} · Máximo {currentLottery.ticketMax} por compra
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {currentLottery.rulesMd ? (
              <RulesPdfButton
                title="Regras"
                markdown={currentLottery.rulesMd}
                filename={`${currentLottery.slug}-regras`}
              />
            ) : null}
            {currentLottery.privacyPolicyMd ? (
              <RulesPdfButton
                title="Política de Privacidade"
                markdown={currentLottery.privacyPolicyMd}
                filename={`${currentLottery.slug}-politica`}
              />
            ) : null}
          </div>
        </div>
      </div>

      {currentLottery.descriptionMd ? (
        <div className="mt-10 rounded-xl bg-white p-6 shadow-sm">
          <MarkdownView content={currentLottery.descriptionMd} />
        </div>
      ) : null}

      <div className="mt-10">
        <h2 className="mb-4 font-display text-2xl text-fortuno-black">Escolha seu pacote</h2>
        <ComboSelector
          combos={currentLottery.combos ?? []}
          ticketPrice={currentLottery.ticketPrice}
          minQty={currentLottery.ticketMin}
          maxQty={currentLottery.ticketMax}
          initialQuantity={selectedQuantity}
          onChange={(q) => setSelectedQuantity(q)}
        />
      </div>

      <div className="mt-10 flex justify-center">
        <button type="button" onClick={startCheckout} className="btn-primary text-lg">
          Comprar {selectedQuantity} {selectedQuantity === 1 ? 'bilhete' : 'bilhetes'}
        </button>
      </div>
    </section>
  );
};
