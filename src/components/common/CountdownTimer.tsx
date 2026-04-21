import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  expiresAt: Date | string;
  onExpire?: () => void;
  className?: string;
}

const msToMMSS = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

export const CountdownTimer = ({
  expiresAt,
  onExpire,
  className,
}: CountdownTimerProps): JSX.Element => {
  const target = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const [remainingMs, setRemainingMs] = useState(() => target.getTime() - Date.now());

  useEffect(() => {
    const tick = () => {
      const left = target.getTime() - Date.now();
      setRemainingMs(left);
      if (left <= 0) {
        onExpire?.();
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target, onExpire]);

  const expired = remainingMs <= 0;

  return (
    <div
      className={
        className ??
        `inline-flex items-center gap-2 rounded-md px-3 py-2 font-mono text-lg font-semibold ${
          expired
            ? 'bg-red-600/10 text-red-700'
            : 'bg-fortuno-gold-intense/15 text-fortuno-black'
        }`
      }
      aria-live="polite"
    >
      <span aria-hidden="true">⏱</span>
      <span>{msToMMSS(remainingMs)}</span>
    </div>
  );
};
