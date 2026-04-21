import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLottery } from '@/hooks/useLottery';
import { WizardShell, type WizardStepMeta } from '@/components/wizard/WizardShell';
import {
  Step1BasicData,
  emptyDraft,
  draftFromLottery,
  type WizardDraft,
} from './wizard-steps/Step1BasicData';
import { Step2NumberFormat } from './wizard-steps/Step2NumberFormat';
import { Step3Descriptions } from './wizard-steps/Step3Descriptions';
import { Step4Images } from './wizard-steps/Step4Images';
import { Step5Combos } from './wizard-steps/Step5Combos';
import { Step6Raffles } from './wizard-steps/Step6Raffles';
import { Step7Awards } from './wizard-steps/Step7Awards';
import { Step8Activate } from './wizard-steps/Step8Activate';

const STEPS: WizardStepMeta[] = [
  { index: 0, key: 'basic', title: 'Dados básicos' },
  { index: 1, key: 'number', title: 'Numeração' },
  { index: 2, key: 'desc', title: 'Descrições' },
  { index: 3, key: 'images', title: 'Imagens' },
  { index: 4, key: 'combos', title: 'Combos' },
  { index: 5, key: 'raffles', title: 'Sorteios' },
  { index: 6, key: 'awards', title: 'Prêmios' },
  { index: 7, key: 'activate', title: 'Ativar' },
];

const STORAGE_KEY = (id: string): string => `fortuno:wizard:${id}`;

export const LotteryWizardPage = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentLottery, loadById, create, update, publish } = useLottery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draft, setDraft] = useState<WizardDraft>(emptyDraft());
  const [busy, setBusy] = useState(false);

  const isNew = !id || id === 'novo';
  const storageId = isNew ? 'new' : id;

  useEffect(() => {
    if (!isNew && id) {
      void loadById(Number(id)).then((l) => {
        if (l) setDraft(draftFromLottery(l));
      });
    } else {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY(storageId));
        if (raw) {
          const parsed = JSON.parse(raw) as {
            currentIndex?: number;
            draft?: WizardDraft;
          };
          if (parsed.draft) setDraft(parsed.draft);
          if (typeof parsed.currentIndex === 'number') setCurrentIndex(parsed.currentIndex);
        }
      } catch {
        // ignore
      }
    }
  }, [id, isNew, loadById, storageId]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY(storageId),
        JSON.stringify({ currentIndex, draft }),
      );
    } catch {
      // ignore
    }
  }, [currentIndex, draft, storageId]);

  const goNext = async (): Promise<void> => {
    // Ao sair do Step 1, persistir a lottery (create/update) para ter lotteryId
    if (currentIndex === 0) {
      setBusy(true);
      const storeId = Number(import.meta.env.VITE_FORTUNO_STORE_ID || 1);
      const payload = {
        ...draft,
        storeId,
      };
      let result = currentLottery;
      if (!draft.lotteryId) {
        result = await create(payload);
      } else {
        result = await update({ ...payload, lotteryId: draft.lotteryId });
      }
      setBusy(false);
      if (!result) return;
      setDraft((prev) => ({ ...prev, lotteryId: result!.lotteryId }));
    }

    if (currentIndex === STEPS.length - 1) {
      // Finalizar — publicar
      if (!draft.lotteryId) {
        toast.error('Salve o sorteio antes de ativar.');
        return;
      }
      setBusy(true);
      const ok = await publish(draft.lotteryId);
      setBusy(false);
      if (ok) {
        try {
          sessionStorage.removeItem(STORAGE_KEY(storageId));
        } catch {
          // ignore
        }
        navigate('/meus-sorteios');
      }
      return;
    }

    setCurrentIndex((i) => Math.min(STEPS.length - 1, i + 1));
  };

  const goPrev = (): void => setCurrentIndex((i) => Math.max(0, i - 1));
  const goJump = (i: number): void => setCurrentIndex(i);

  const lotteryIdForChildSteps = draft.lotteryId;

  const renderStep = (): JSX.Element => {
    switch (currentIndex) {
      case 0:
        return <Step1BasicData draft={draft} setDraft={setDraft} />;
      case 1:
        return <Step2NumberFormat draft={draft} setDraft={setDraft} />;
      case 2:
        return <Step3Descriptions draft={draft} setDraft={setDraft} />;
      case 3:
        return lotteryIdForChildSteps ? (
          <Step4Images lotteryId={lotteryIdForChildSteps} />
        ) : (
          <p>Finalize a etapa 1 para liberar o cadastro de imagens.</p>
        );
      case 4:
        return lotteryIdForChildSteps ? (
          <Step5Combos lotteryId={lotteryIdForChildSteps} />
        ) : (
          <p>Finalize a etapa 1 para liberar os combos.</p>
        );
      case 5:
        return lotteryIdForChildSteps ? (
          <Step6Raffles lotteryId={lotteryIdForChildSteps} />
        ) : (
          <p>Finalize a etapa 1 para liberar os sorteios.</p>
        );
      case 6:
        return lotteryIdForChildSteps ? (
          <Step7Awards lotteryId={lotteryIdForChildSteps} />
        ) : (
          <p>Finalize a etapa 1 para liberar os prêmios.</p>
        );
      case 7:
        return lotteryIdForChildSteps ? (
          <Step8Activate lotteryId={lotteryIdForChildSteps} />
        ) : (
          <p>Finalize a etapa 1 antes de ativar.</p>
        );
      default:
        return <></>;
    }
  };

  return (
    <WizardShell
      steps={STEPS}
      currentIndex={currentIndex}
      onPrev={goPrev}
      onNext={() => void goNext()}
      onJump={goJump}
      busy={busy}
      nextLabel={currentIndex === STEPS.length - 1 ? 'Ativar sorteio' : 'Próximo'}
    >
      {renderStep()}
    </WizardShell>
  );
};
