import { Plus } from "lucide-react";
import EnvelopeCard from "./EnvelopeCard";

export default function EnvelopeSidebar() {
  return (
    <div className="bg-light-50 min-h-screen px-6 text-gray-800">
      <div className="py-4">profile</div>
      <div className="py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold capitalize">envelopes</h2>
          <button className="p-2 border border-dashed border-slate-400 text-slate-400 rounded-lg">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex flex-col space-y-6">
          <EnvelopeCard />
          <EnvelopeCard />
          <EnvelopeCard />
        </div>
      </div>
    </div>
  );
}
