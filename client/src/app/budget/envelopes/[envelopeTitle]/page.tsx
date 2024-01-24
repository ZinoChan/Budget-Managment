import { GraduationCap } from "lucide-react";
import Filters from "../../components/Filters";
import TransactionCard from "../../components/TransactionCard";

export default function EnvelopeTransacitons() {
  return (
    <div>
      <header className="py-4">
        <h1 className="text-3xl font-bold">Kakeibo</h1>
      </header>
      <div className="py-12 flex items-center justify-between">
        <div className="flex space-x-4 items-center">
          <div className="text-white rounded p-2 bg-yellow-500/40">
            <GraduationCap size={32} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1 text-blue-500">
              Education
            </h3>
            <p className="text-sm text-slate-500">$249.000</p>
          </div>
        </div>
        <button className="px-4 py-2 rounded text-white bg-blue-500">
          Add transaction
        </button>
      </div>
      <Filters />
      <div>
        <TransactionCard />
        <TransactionCard />
        <TransactionCard />
        <TransactionCard />
      </div>
    </div>
  );
}
