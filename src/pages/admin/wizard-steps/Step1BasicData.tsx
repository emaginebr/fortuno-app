import type { Dispatch, SetStateAction } from 'react';
import type { LotteryInfo } from '@/types/lottery';

export interface WizardDraft {
  lotteryId: number | null;
  name: string;
  descriptionMd: string;
  rulesMd: string;
  privacyPolicyMd: string;
  ticketPrice: number;
  totalPrizeValue: number;
  ticketMin: number;
  ticketMax: number;
  ticketNumIni: number;
  ticketNumEnd: number;
  numberType: number;
  numberValueMin: number;
  numberValueMax: number;
  referralPercent: number;
}

export const emptyDraft = (): WizardDraft => ({
  lotteryId: null,
  name: '',
  descriptionMd: '',
  rulesMd: '',
  privacyPolicyMd: '',
  ticketPrice: 10,
  totalPrizeValue: 10000,
  ticketMin: 1,
  ticketMax: 100,
  ticketNumIni: 1,
  ticketNumEnd: 1000,
  numberType: 1,
  numberValueMin: 1,
  numberValueMax: 60,
  referralPercent: 5,
});

export const draftFromLottery = (lottery: LotteryInfo): WizardDraft => ({
  lotteryId: lottery.lotteryId,
  name: lottery.name,
  descriptionMd: lottery.descriptionMd,
  rulesMd: lottery.rulesMd,
  privacyPolicyMd: lottery.privacyPolicyMd,
  ticketPrice: lottery.ticketPrice,
  totalPrizeValue: lottery.totalPrizeValue,
  ticketMin: lottery.ticketMin,
  ticketMax: lottery.ticketMax,
  ticketNumIni: lottery.ticketNumIni,
  ticketNumEnd: lottery.ticketNumEnd,
  numberType: lottery.numberType,
  numberValueMin: lottery.numberValueMin,
  numberValueMax: lottery.numberValueMax,
  referralPercent: lottery.referralPercent,
});

interface Step1Props {
  draft: WizardDraft;
  setDraft: Dispatch<SetStateAction<WizardDraft>>;
}

export const Step1BasicData = ({ draft, setDraft }: Step1Props): JSX.Element => {
  const update = <K extends keyof WizardDraft>(key: K, value: WizardDraft[K]): void =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="md:col-span-2">
        <span className="text-sm font-semibold">Nome do sorteio</span>
        <input
          type="text"
          value={draft.name}
          onChange={(e) => update('name', e.target.value)}
          className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
          required
        />
      </label>

      <label className="md:col-span-2">
        <span className="text-sm font-semibold">Descrição curta</span>
        <textarea
          value={draft.descriptionMd}
          onChange={(e) => update('descriptionMd', e.target.value)}
          className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
          rows={3}
        />
      </label>

      <label>
        <span className="text-sm font-semibold">Preço do bilhete (R$)</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={draft.ticketPrice}
          onChange={(e) => update('ticketPrice', Number(e.target.value))}
          className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
        />
      </label>

      <label>
        <span className="text-sm font-semibold">Valor total dos prêmios (R$)</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={draft.totalPrizeValue}
          onChange={(e) => update('totalPrizeValue', Number(e.target.value))}
          className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
        />
      </label>

      <label>
        <span className="text-sm font-semibold">Qtd mínima de bilhetes por compra</span>
        <input
          type="number"
          min="1"
          value={draft.ticketMin}
          onChange={(e) => update('ticketMin', Number(e.target.value))}
          className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
        />
      </label>

      <label>
        <span className="text-sm font-semibold">Qtd máxima de bilhetes por compra</span>
        <input
          type="number"
          min="1"
          value={draft.ticketMax}
          onChange={(e) => update('ticketMax', Number(e.target.value))}
          className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
        />
      </label>

      <label className="md:col-span-2">
        <span className="text-sm font-semibold">% de comissão por indicação</span>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={draft.referralPercent}
          onChange={(e) => update('referralPercent', Number(e.target.value))}
          className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
        />
      </label>
    </div>
  );
};
