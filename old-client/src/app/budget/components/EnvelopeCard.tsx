import { GraduationCap } from "lucide-react";

export default function EnvelopeCard() {
  return (
    <div className="flex space-x-4 items-center">
      <div className="text-white rounded-lg p-2 bg-yellow-400">
        <GraduationCap size={24} />
      </div>
      <div>
        <h5 className="font-bold mb-1">Education</h5>
        <p className="text-sm text-slate-500">$249.000</p>
      </div>
    </div>
  );
}
