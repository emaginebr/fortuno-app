interface LoadingSpinnerProps {
  label?: string;
  size?: number;
}

export const LoadingSpinner = ({ label, size = 48 }: LoadingSpinnerProps): JSX.Element => (
  <div
    role="status"
    aria-live="polite"
    className="flex flex-col items-center justify-center gap-3 py-8 text-fortuno-gold-intense"
  >
    <svg
      className="animate-spin"
      style={{ width: size, height: size }}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-85"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
      />
    </svg>
    {label ? <p className="text-sm font-medium">{label}</p> : null}
  </div>
);
