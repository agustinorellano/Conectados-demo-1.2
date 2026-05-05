import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { normalizeValue } from '../../utils/companyProfile';

function TagSelector({ label, options = [], selected = [], onChange, placeholder }) {
  const [customValue, setCustomValue] = useState('');

  const toggleValue = (value) => {
    const exists = selected.some((item) => normalizeValue(item) === normalizeValue(value));
    onChange(
      exists
        ? selected.filter((item) => normalizeValue(item) !== normalizeValue(value))
        : [...selected, value]
    );
  };

  const handleAddCustom = () => {
    const nextValue = customValue.trim();
    if (!nextValue) {
      return;
    }

    if (!selected.some((item) => normalizeValue(item) === normalizeValue(nextValue))) {
      onChange([...selected, nextValue]);
    }
    setCustomValue('');
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-[#1A1A1A]">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.some(
            (item) => normalizeValue(item) === normalizeValue(option)
          );

          return (
            <button
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                isSelected
                  ? 'bg-[#1871D8] text-white'
                  : 'bg-slate-100 text-slate-500 hover:text-[#0B412F]'
              }`}
              key={option}
              onClick={() => toggleValue(option)}
              type="button"
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {selected.map((item) => (
          <span
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-[#1A1A1A] shadow-sm ring-1 ring-inset ring-slate-200"
            key={item}
          >
            {item}
            <button
              className="text-slate-400 hover:text-rose-500"
              onClick={() => toggleValue(item)}
              type="button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          onChange={(event) => setCustomValue(event.target.value)}
          placeholder={placeholder}
          value={customValue}
        />
        <button
          className="inline-flex items-center gap-2 rounded-[16px] bg-[#0B412F] px-4 py-3 text-sm font-semibold text-white"
          onClick={handleAddCustom}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </div>
    </div>
  );
}

export default TagSelector;
