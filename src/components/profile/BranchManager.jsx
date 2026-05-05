import { Plus, Trash2 } from 'lucide-react';

function BranchManager({ branches, onAddBranch, onChangeBranch, onDeleteBranch }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-[#1A1A1A]">Sucursales</label>
        <button
          className="inline-flex items-center gap-2 rounded-[16px] bg-[#1871D8] px-4 py-3 text-sm font-semibold text-white"
          onClick={onAddBranch}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Agregar sucursal
        </button>
      </div>

      <div className="space-y-3">
        {branches.map((branch, index) => (
          <div
            className="rounded-[20px] bg-slate-50 p-4 ring-1 ring-inset ring-slate-200"
            key={`${branch.address}-${index}`}
          >
            <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
              <input
                className="rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm"
                onChange={(event) => onChangeBranch(index, 'address', event.target.value)}
                placeholder="Direccion"
                value={branch.address}
              />
              <input
                className="rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm"
                onChange={(event) => onChangeBranch(index, 'city', event.target.value)}
                placeholder="Ciudad"
                value={branch.city}
              />
              <input
                className="rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm"
                onChange={(event) => onChangeBranch(index, 'country', event.target.value)}
                placeholder="Pais"
                value={branch.country}
              />
              <button
                className="inline-flex items-center justify-center rounded-[16px] bg-white px-4 py-3 text-rose-500 shadow-sm ring-1 ring-inset ring-slate-200"
                onClick={() => onDeleteBranch(index)}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BranchManager;
