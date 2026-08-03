import { Download, Share2, Trees } from 'lucide-react';

interface CertificateCardProps {
  treeName: string;
  location: string;
  date: string;
  co2Value: string;
}

export default function CertificateCard({ treeName, location, date, co2Value }: CertificateCardProps) {
  return (
    <div className="bg-white border-8 border-emerald-800/10 rounded-2xl p-6 shadow-xl relative overflow-hidden font-sans">
      {/* Decorative border pattern */}
      <div className="absolute inset-0 border-[1px] border-emerald-800/20 m-1 pointer-events-none" />
      
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
          <Trees className="w-12 h-12 text-emerald-700" />
        </div>
        
        <div>
          <h2 className="text-2xl font-black text-emerald-900 mb-1">আমি একটি গাছ রোপণ করেছি</h2>
          <div className="h-1 w-20 bg-emerald-600 mx-auto rounded-full" />
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-bold">গাছের নাম:</span> {treeName}</p>
          <p><span className="font-bold">অবস্থান:</span> {location}</p>
          <p><span className="font-bold">তারিখ:</span> {date}</p>
          <p><span className="font-bold">GPS Verified:</span> ✅ হ্যাঁ</p>
          <p><span className="font-bold">কার্বন অবদান:</span> {co2Value} কেজি CO₂ (আনুমানিক)</p>
        </div>

        <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 italic font-bold text-emerald-800">
          "সবুজ বাংলাদেশ গড়তে আমার অঙ্গীকার"
        </div>

        <div className="flex gap-3 mt-4 w-full">
          <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 text-white py-2.5 rounded-lg font-bold text-xs shadow-md hover:bg-emerald-800 transition-all cursor-pointer">
            <Download size={16} /> ডাউনলোড
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-bold text-xs shadow-md hover:bg-blue-700 transition-all cursor-pointer">
            <Share2 size={16} /> শেয়ার করুন
          </button>
        </div>
      </div>
    </div>
  );
}
