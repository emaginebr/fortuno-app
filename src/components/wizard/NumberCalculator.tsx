import { NumberType } from '@/types/enums';
import { computePossibilities, generateExamples, formatInt64 } from '@/utils/numberFormat';

interface NumberCalculatorProps {
  numberType: NumberType;
  numberValueMin: number;
  numberValueMax: number;
  ticketNumIni: number;
  ticketNumEnd: number;
  ticketMax: number;
}

export const NumberCalculator = (props: NumberCalculatorProps): JSX.Element => {
  const { numberType, numberValueMin, numberValueMax, ticketNumIni, ticketNumEnd, ticketMax } =
    props;

  const total = computePossibilities(
    numberType,
    numberValueMin,
    numberValueMax,
    ticketNumIni,
    ticketNumEnd,
  );

  const examples = generateExamples(
    numberType,
    numberValueMin,
    numberValueMax,
    ticketNumIni,
    ticketNumEnd,
  );

  const insufficient = total > 0 && total < ticketMax;

  return (
    <div className="rounded-xl border border-fortuno-gold-intense/30 bg-fortuno-offwhite p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-fortuno-gold-intense">
        Total de possibilidades de bilhetes
      </h3>
      <p className="mt-2 font-display text-3xl text-fortuno-black">
        {total > 0 ? formatInt64(total) : '—'}
      </p>
      {examples.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-wider text-fortuno-black/60">
            Exemplos de números válidos
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {examples.map((ex) => (
              <li
                key={ex}
                className="rounded bg-white px-3 py-1 font-mono text-sm text-fortuno-black shadow-sm"
              >
                {ex}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {insufficient ? (
        <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">
          ⚠️ O total de possibilidades é menor que o máximo de bilhetes por compra. Revise os
          intervalos.
        </p>
      ) : null}
    </div>
  );
};
