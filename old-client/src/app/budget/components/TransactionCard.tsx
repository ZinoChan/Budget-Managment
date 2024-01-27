import { Book, EyeIcon, MoreVertical } from "lucide-react";

export default function TransactionCard() {
  return (
    <div className="rounded-xl bg-white shadow-md p-6 flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="bg-purple-400/10 text-purple-400 rounded-lg p-2">
          <Book />
        </div>
        <div>
          <h4 className="font-semibold mb-1">Books and docs</h4>
          <p className="text-sm text-slate-500">$249.000</p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <h5 className="font-bold">-$99.00</h5>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg bg-sky-100 text-sm text-sky-500">
            <EyeIcon size={16} />
          </button>
          <button className="p-2 rounded-lg bg-slate-100 text-sm text-slate-400">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
