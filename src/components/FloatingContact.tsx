import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

export const FloatingContact: React.FC = () => {
  const phoneNumber = '0944405124';
  const zaloLink = `https://zalo.me/${phoneNumber}`;

  return (
    <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 animate-in slide-in-from-top-8 duration-500">
      

      {/* Nút Zalo với QR Code */}
      <div className="relative group flex items-center justify-center">
        <a 
          href={zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 transition-transform hover:scale-110 active:scale-95 z-10"
          title="Chat Zalo với thầy"
        >
          {/* Biểu tượng Zalo đơn giản */}
          <div className="font-extrabold text-xl font-sans tracking-tighter">Zalo</div>
          
          <span className="absolute right-full mr-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
            Chat Zalo
          </span>
        </a>

        {/* QR Code Popup (Hiện khi hover vào nút Zalo) */}
        <div className="absolute right-full mr-4 top-0 opacity-0 scale-90 origin-top-right group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-2 w-48">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Quét mã Zalo</h4>
            <div className="w-full aspect-square bg-white rounded-xl overflow-hidden flex items-center justify-center p-1 border border-slate-100 dark:border-slate-700">
              <img src="/zalo-qr.png" alt="Zalo QR Code" className="w-full h-full object-contain" />
            </div>
            <p className="text-[10px] text-slate-500 text-center leading-tight">Mở app Zalo để quét mã<br/>hoặc click nút xanh bên cạnh</p>
          </div>
        </div>
      </div>

    </div>
  );
};
