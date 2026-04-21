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
          </label>
          <label>
            <span className="text-sm font-semibold">Número final</span>
            <input
              type="number"
              min="0"
              value={draft.ticketNumEnd}
              onChange={(e) => update('ticketNumEnd', Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
            />
          </label>
        </>
      ) : (
        <>
          <label>
            <span className="text-sm font-semibold">Valor mínimo da dezena</span>
            <input
              type="number"
              min="0"
              value={draft.numberValueMin}
              onChange={(e) => update('numberValueMin', Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-sm font-semibold">Valor máximo da dezena</span>
            <input
              type="number"
              min="0"
              value={draft.numberValueMax}
              onChange={(e) => update('numberValueMax', Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
            />
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
