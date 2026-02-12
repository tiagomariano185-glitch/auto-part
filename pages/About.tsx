
import React from 'react';
import { History, Target, Eye, ShieldCheck, Leaf, Users, Truck, Globe, Award } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1920" 
            alt="Operação AutoPart" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            Nossa História
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">Quem Somos</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Referência nacional em desmanche especializado com mais de 20 anos de tradição e inovação digital.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-orange-600 mb-2">
                <History size={24} />
                <span className="font-black uppercase tracking-widest text-sm">Trajetória e Evolução</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 leading-tight">Vinte Anos de Compromisso e Ética Automotiva.</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                A <strong>AutoPart – Desmanche Especializado</strong> é uma empresa com mais de 20 anos de atuação no mercado automotivo, dedicada à comercialização de autopeças usadas com procedência comprovada, responsabilidade ambiental e plena conformidade com a legislação vigente.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Ao longo de mais de duas décadas, consolidamos nossa reputação com base em ética, transparência e compromisso com a qualidade. Nossos processos seguem critérios rigorosos de controle e rastreabilidade, assegurando segurança jurídica e confiança em cada negociação.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1498887960847-2a5e46312788?auto=format&fit=crop&q=80&w=800" 
                  alt="Desmanche Especializado AutoPart" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-orange-600 text-white p-8 rounded-3xl shadow-xl">
                <span className="block text-4xl font-black mb-1">20+</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Anos de Mercado</span>
              </div>
            </div>
          </div>

          {/* Business Model Highlight */}
          <div className="bg-slate-50 rounded-[4rem] p-12 md:p-20 mb-24 border border-slate-100">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex p-4 bg-white rounded-3xl shadow-sm mb-4">
                <Globe className="text-orange-600" size={32} />
              </div>
              <h3 className="text-3xl font-black text-slate-900">Operação 100% Digital e Eficiente</h3>
              <p className="text-slate-600 text-xl leading-relaxed font-medium">
                A AutoPart opera em modelo 100% online, não mantendo loja física tradicional. Essa estrutura estratégica nos permite atuar com maior eficiência operacional e praticar preços mais competitivos. Trabalhamos por meio de uma ampla rede de pátios e parceiros filiados em todo o Brasil.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 text-left">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Truck className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Logística Própria</h4>
                    <p className="text-sm text-slate-500 font-medium">Controle total de prazos e segurança no transporte em todo território nacional.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Award className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Qualidade Revisada</h4>
                    <p className="text-sm text-slate-500 font-medium">Peças testadas e com procedência garantida de seguradoras e leilões.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Vision Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <div className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-xl relative overflow-hidden group">
              <Target className="text-orange-600 mb-6 group-hover:scale-110 transition-transform" size={48} />
              <h3 className="text-2xl font-black mb-4">Missão</h3>
              <p className="text-slate-300 leading-relaxed font-medium">
                Fornecer autopeças usadas com procedência garantida, assegurando qualidade, rastreabilidade e atendimento eficiente, promovendo economia ao cliente e contribuindo para a sustentabilidade do setor automotivo.
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-12 rounded-[3rem] shadow-sm relative overflow-hidden group">
              <Eye className="text-orange-600 mb-6 group-hover:scale-110 transition-transform" size={48} />
              <h3 className="text-2xl font-black text-slate-900 mb-4">Visão</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Ser reconhecida nacionalmente como referência em desmanche especializado 100% digital, destacando-se pela credibilidade, experiência consolidada de mais de 20 anos, excelência logística e compromisso com a conformidade legal.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div>
            <div className="text-center mb-16">
              <h3 className="text-3xl font-black text-slate-900 mb-4">Nossos Valores</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Os pilares que sustentam nossa empresa</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: ShieldCheck, title: 'Ética e Transparência', desc: 'Relações comerciais sólidas e honestas.' },
                { icon: Globe, title: 'Conformidade Legal', desc: 'Total responsabilidade setorial e jurídica.' },
                { icon: Leaf, title: 'Responsabilidade Ambiental', desc: 'Reaproveitamento consciente e ecológico.' },
                { icon: Award, title: 'Procedência Comprovada', desc: 'Rastreabilidade e qualidade em cada peça.' },
                { icon: Users, title: 'Foco no Cliente', desc: 'Atendimento ágil e personalizado.' },
                { icon: Truck, title: 'Excelência Logística', desc: 'Frota própria e entregas seguras.' },
                { icon: History, title: 'Credibilidade', desc: 'Construída em 2 décadas de mercado.' },
                { icon: Globe, title: 'Inovação Digital', desc: 'Eficiência no modelo 100% online.' },
              ].map((value, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                    <value.icon size={24} />
                  </div>
                  <h4 className="font-black text-slate-900 mb-2 leading-tight">{value.title}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
