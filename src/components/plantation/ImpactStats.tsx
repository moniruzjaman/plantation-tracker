import { Cloud, Wind, Sun, Leaf } from 'lucide-react';

interface ImpactStatsProps {
  quantity: number;
  years?: number;
}

export default function ImpactStats({ quantity, years = 2.8 }: ImpactStatsProps) {
  // Constants based on the design image for a tree at ~2.8 years
  // 1 tree -> 45.6 kg CO2, 35.2 kg O2, 64 sq. meters shade
  const co2PerTree = 45.6;
  const o2PerTree = 35.2;
  const shadePerTree = 64;
  const environmentScoreBase = 8.6;

  const totalCo2 = (quantity * co2PerTree).toFixed(1);
  const totalO2 = (quantity * o2PerTree).toFixed(1);
  const totalShade = (quantity * shadePerTree).toFixed(0);

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
          <Cloud className="text-white w-6 h-6" />
        </div>
        <div>
          <div className="text-[10px] text-emerald-600 font-bold uppercase">CO₂ শোষণ (আনুমানিক)</div>
          <div className="text-lg font-black text-emerald-800">{totalCo2} কেজি</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
          <Wind className="text-white w-6 h-6" />
        </div>
        <div>
          <div className="text-[10px] text-blue-600 font-bold uppercase">অক্সিজেন উৎপাদন (আনুমানিক)</div>
          <div className="text-lg font-black text-blue-800">{totalO2} কেজি</div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
          <Sun className="text-white w-6 h-6" />
        </div>
        <div>
          <div className="text-[10px] text-amber-600 font-bold uppercase">ছায়া এলাকা (আনুমানিক)</div>
          <div className="text-lg font-black text-amber-800">{totalShade} বর্গমিটার</div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shrink-0">
          <Leaf className="text-white w-6 h-6" />
        </div>
        <div>
          <div className="text-[10px] text-green-600 font-bold uppercase">পরিবেশ স্কোর</div>
          <div className="text-lg font-black text-green-800">{environmentScoreBase} / ১০</div>
        </div>
      </div>
    </div>
  );
}
