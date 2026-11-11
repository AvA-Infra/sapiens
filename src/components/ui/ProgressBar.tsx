/** Barra de progresso acessível (valor de 0 a 100). */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-2.5 w-full overflow-hidden rounded-full bg-sky-100"
    >
      <div className="h-full rounded-full bg-sky-500" style={{ width: `${value}%` }} />
    </div>
  );
}
