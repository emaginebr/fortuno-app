import type { Dispatch, SetStateAction } from 'react';
import type { WizardDraft } from './Step1BasicData';
import { NUMBER_TYPE_LABEL, NumberType } from '@/types/enums';
import { NumberCalculator } from '@/components/wizard/NumberCalculator';

interface Step2Props {
  draft: WizardDraft;
  setDraft: Dispatch<SetStateAction<WizardDraft>>;
}

export const Step2NumberFormat = ({ draft, setDraft }: Step2Props): JSX.Element => {
  const update = <K extends keyof WizardDraft>(key: K, value: WizardDraft[K]): void =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const isInt64 = draft.numberType === NumberType.Int64;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <label className="md:col-span-2">
        <span className="text-sm font-semibold">Formato do número</span>
        <select
          value={draft.numberType}
          onChange={(e) => update('numberType', Number(e.target.value))}
          className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
        >
          {Object.entries(NUMBER_TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>

      {/*
        Visualização condicional por NumberType (§7 de
        FRONTEND_TICKET_NUMBER_FORMAT_MIGRATION.md):
        - Int64     → ticketNumIni / ticketNumEnd (faixa do bilhete inteiro).
        - Composed* → numberValueMin / numberValueMax (faixa de cada componente, 0..99).
        Os campos ocultos não são zerados no draft para preservar a entrada do
        usuário caso ele alterne o NumberType; o LotteryWizardPage garante no
        submit que o payload envia 0 nos campos ignorados pelo backend.
      */}
      {isInt64 ? (
        <>
          <label>
            <span className="text-sm font-semibold">Número inicial</span>
            <input
              type="number"
              min="0"
              value={draft.ticketNumIni}
              onChange={(e) => update('ticketNumIni', Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
            />
            <span className="mt-1 block text-xs text-fortuno-black/55">
              O primeiro número emitido — tipicamente 1.
            </span>
          </label>
          <label>
            <span className="text-sm font-semibold">Número final</span>
            <input
              type="number"
              min="1"
              value={draft.ticketNumEnd}
              onChange={(e) => update('ticketNumEnd', Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
            />
            <span className="mt-1 block text-xs text-fortuno-black/55">
              Deve ser maior ou igual ao inicial e maior que zero.
            </span>
          </label>
        </>
      ) : (
        <>
          <label>
            <span className="text-sm font-semibold">
              Valor mínimo por componente
            </span>
            <input
              type="number"
              min="0"
              max="99"
              value={draft.numberValueMin}
              onChange={(e) => update('numberValueMin', Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
            />
            <span className="mt-1 block text-xs text-fortuno-black/55">
              Faixa permitida: 0 a 99.
            </span>
          </label>
          <label>
            <span className="text-sm font-semibold">
              Valor máximo por componente
            </span>
            <input
              type="number"
              min="0"
              max="99"
              value={draft.numberValueMax}
              onChange={(e) => update('numberValueMax', Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
            />
            <span className="mt-1 block text-xs text-fortuno-black/55">
              Faixa permitida: 0 a 99 — deve ser ≥ mínimo.
            </span>
          </label>
        </>
      )}

      <div className="md:col-span-2">
        <NumberCalculator
          numberType={draft.numberType}
          numberValueMin={draft.numberValueMin}
          numberValueMax={draft.numberValueMax}
          ticketNumIni={draft.ticketNumIni}
          ticketNumEnd={draft.ticketNumEnd}
          ticketMax={draft.ticketMax}
        />
      </div>
    </div>
  );
};
