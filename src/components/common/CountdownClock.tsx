import { useEffect, useRef, useState } from 'react';

export interface CountdownClockProps {
  /** ISO 8601 do próximo sorteio. Se ausente, o componente não renderiza. */
  targetIso?: string;
  /** Se true, esconde segundos em mobile. */
  compact?: boolean;
  /** Label acima dos dígitos. */
  label?: string;
  className?: string;
}

interface TimeParts {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const computeParts = (targetMs: number, nowMs: number): TimeParts => {
  const totalMs = Math.max(0, targetMs - nowMs);
  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { totalMs, days, hours, minutes, seconds };
};

const pad = (n: number): string => String(Math.max(0, n)).padStart(2, '0');

/**
 * Countdown 4-células (dd:hh:mm:ss) com anúncio a11y via <span sr-only>
 * throttled por minuto para não inundar screen readers.
 */
export const CountdownClock = ({
  targetIso,
  compact = false,
  label = 'Próximo sorteio em',
  className,
}: CountdownClockProps): JSX.Element | null => {
  const targetMs = targetIso ? new Date(targetIso).getTime() : NaN;
  const [parts, setParts] = useState<TimeParts>(() =>
    computeParts(Number.isFinite(targetMs) ? targetMs : Date.now(), Date.now()),
  );
  const lastMinuteAnnouncedRef = useRef<number>(-1);
  const [srLabel, setSrLabel] = useState<string>('');

  useEffect(() => {
    if (!targetIso || !Number.isFinite(targetMs)) return;
    const tick = (): void => {
      const next = computeParts(targetMs, Date.now());
      setParts(next);
      const key = next.days * 1440 + next.hours * 60 + next.minutes;
      if (key !== lastMinuteAnnouncedRef.current) {
        lastMinuteAnnouncedRef.current = key;
        setSrLabel(
          `${next.days} dias, ${next.hours} horas, ${next.minutes} minutos e ${next.seconds} segundos`,
        );
      }
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [targetIso, targetMs]);

  if (!targetIso || !Number.isFinite(targetMs)) {
    return null;
  }

  const wrapperClass = ['', className].filter(Boolean).join(' ').trim();

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Tempo restante até o próximo sorteio"
      className={wrapperClass}
    >
      <p className="text-[10px] uppercase tracking-[0.26em] text-fortuno-offwhite/55 mb-3">
        {label}
      </p>
      <div className="flex items-center gap-2 md:gap-2.5">
        <div className="countdown-cell flex-1">
          <div className="countdown-num">{pad(parts.days)}</div>
          <div className="countdown-label">dias</div>
        </div>
        <span
          className="text-fortuno-gold-soft/55 font-display italic"
          aria-hidden="true"
        >
          :
        </span>
        <div className="countdown-cell flex-1">
          <div className="countdown-num">{pad(parts.hours)}</div>
          <div className="countdown-label">h</div>
        </div>
        <span
          className="text-fortuno-gold-soft/55 font-display italic"
          aria-hidden="true"
        >
          :
        </span>
        <div className="countdown-cell flex-1">
          <div className="countdown-num">{pad(parts.minutes)}</div>
          <div className="countdown-label">min</div>
        </div>
        {!compact && (
          <>
            <span
              className="text-fortuno-gold-soft/55 font-display italic hidden sm:inline"
              aria-hidden="true"
            >
              :
            </span>
            <div className="countdown-cell flex-1 hidden sm:block">
              <div className="countdown-num">{pad(parts.seconds)}</div>
              <div className="countdown-label">seg</div>
            </div>
          </>
        )}
      </div>
      <span className="sr-only">{srLabel}</span>
    </div>
  );
};
