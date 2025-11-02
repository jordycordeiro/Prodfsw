import * as React from 'react';

export type Gender = 'masculino' | 'feminino';

type Props = {
  value: Gender;
  onChange: (value: Gender) => void;
  className?: string;
  labels?: { masculino?: string; feminino?: string };
};

// Segmented "pill" toggle with proper a11y (aria-pressed) and keyboard support
const GenderToggle: React.FC<Props> = ({ value, onChange, className = '', labels }) => {
  const masculinoActive = value === 'masculino';
  const femininoActive = value === 'feminino';

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      onChange(masculinoActive ? 'feminino' : 'masculino');
    }
  };

  const L = {
    masculino: labels?.masculino ?? 'Masculino',
    feminino: labels?.feminino ?? 'Feminino',
  };

  return (
    <div
      role="group"
      aria-label="Sexo"
      className={`inline-flex rounded-xl overflow-hidden border divide-x ${className}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        className={`px-3 py-2 text-sm font-semibold flex items-center gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
          masculinoActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-slate-900 hover:bg-slate-50'
        }`}
        onClick={() => onChange('masculino')}
        aria-pressed={masculinoActive}
      >
        <span aria-hidden>♂</span>
        <span>{L.masculino}</span>
      </button>

      <button
        type="button"
        className={`px-3 py-2 text-sm font-semibold flex items-center gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
          femininoActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-slate-900 hover:bg-slate-50'
        }`}
        onClick={() => onChange('feminino')}
        aria-pressed={femininoActive}
      >
        <span aria-hidden>♀</span>
        <span>{L.feminino}</span>
      </button>
    </div>
  );
};

export default GenderToggle;
