import { ChevronsUpDown } from "lucide-react";

export default function Filters() {
  return (
    <div className="flex items-center space-x-4 justify-center mb-8">
      <button className="rounded-lg flex items-center space-x-1 border border-slate-400 text-slate-400 text-sm font-medium capitalize px-4 py-2">
        <span>Group by</span>
        <ChevronsUpDown size={16} />
      </button>
      <button className="rounded-lg flex items-center space-x-1 border border-slate-400 text-slate-400 text-sm font-medium capitalize px-4 py-2">
        <span>Dates</span>
        <ChevronsUpDown size={16} />
      </button>
      <button className="rounded-lg flex items-center space-x-1 border border-slate-400 text-slate-400 text-sm font-medium capitalize px-4 py-2">
        <span>Type</span>
        <ChevronsUpDown size={16} />
      </button>
      <button className="rounded-lg flex items-center space-x-1 border border-slate-400 text-slate-400 text-sm font-medium capitalize px-4 py-2">
        <span>Amount</span>
        <ChevronsUpDown size={16} />
      </button>
    </div>
  );
}
