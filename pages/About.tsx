
import React from 'react';
import { History, Target, Eye, ShieldCheck, Leaf, Users, Truck, Globe, Award } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover opacity-20" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <span className="inline-block bg-orange-600 px-4 py-1 rounded-full text-xs font-black uppercase mb-6">Nossa História</span>
          <h1 className="text-5xl md:text-6xl font-black mb-6">Quem Somos</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-medium">Referência nacional em desmanche especializado com mais de 20 anos de tradição.</p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-slate-900 leading-tight">Vinte Anos de Compromisso e Ética Automotiva.</h2>
              <p className="text-slate-600 text-lg leading-relaxed">A AutoCar – Desmanche Especializado dedica-se à comercialização de autopeças usadas com procedência comprovada e conformidade legal.</p>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">Operamos em modelo 100% online, garantindo preços competitivos e eficiência logística para todo o Brasil.</p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1498887960847-2a5e46312788?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Yard" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-orange-600 text-white p-8 rounded-3xl shadow-xl font-black">
                <span className="block text-4xl">20+</span>
                <span className="text-xs uppercase opacity-80">Anos de Mercado</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <div className="bg-slate-900 text-white p-12 rounded-[3rem]">
              <Target className="text-orange-600 mb-6" size={48} />
              <h3 className="text-2xl font-black mb-4">Missão</h3>
              <p className="text-slate-300 font-medium leading-relaxed">Fornecer autopeças usadas com procedência garantida, economia e sustentabilidade.</p>
            </div>
            <div className="bg-white border border-slate-200 p-12 rounded-[3rem]">
              <Eye className="text-orange-600 mb-6" size={48} />
              <h3 className="text-2xl font-black text-slate-900 mb-4">Visão</h3>
              <p className="text-slate-600 font-medium leading-relaxed">Ser referência nacional em desmanche especializado 100% digital e excelência logística.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
