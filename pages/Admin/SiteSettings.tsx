
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Settings, 
  Save, 
  ChevronLeft, 
  Globe, 
  Phone, 
  Shield, 
  Clock,
  CheckCircle2,
  Package
} from 'lucide-react';
import { mockDb } from '../../services/mockDb';
import { SiteSettings as SiteSettingsType } from '../../types';

export const SiteSettings: React.FC = () => {
  // Fix: Initialize with a default object and load in useEffect
  const [settings, setSettings] = useState<SiteSettingsType>({
    name: '',
    subtext: '',
    whatsapp: '',
    cnpj: '',
    workingHours: { weekdays: '', saturday: '' }
  });
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  // Fix: Await getAuth() to resolve authentication state before loading settings
  useEffect(() => {
    const loadData = async () => {
      const auth = await mockDb.getAuth();
      if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
        navigate('/login');
        return;
      }
      
      const data = await mockDb.getSettings();
      setSettings(data);
    };
    loadData();
  }, [navigate]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center border border-slate-200">
              <Settings size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Configurações Gerais</h1>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Link to="/admin/produtos" className="hover:text-orange-600 underline">Voltar para Estoque</Link>
                <span>•</span>
                <span>Dados de exibição pública</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            className="bg-orange-600 text-white px-10 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg active:scale-95 uppercase text-xs tracking-widest"
          >
            {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {saved ? 'Dados Salvos!' : 'Salvar Dados'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Branding Section */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="flex items-center gap-3 text-xl font-black text-slate-900 uppercase tracking-tighter">
              < Globe className="text-orange-600" size={24} /> Identidade do Site
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Nome da Loja</label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                  value={settings.name}
                  onChange={e => setSettings({...settings, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Slogan / Especialidade</label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                  value={settings.subtext}
                  onChange={e => setSettings({...settings, subtext: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="flex items-center gap-3 text-xl font-black text-slate-900 uppercase tracking-tighter">
              <Phone className="text-green-600" size={24} /> Contato e WhatsApp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">WhatsApp de Vendas (DDD + Número)</label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                  value={settings.whatsapp}
                  onChange={e => setSettings({...settings, whatsapp: e.target.value})}
                  placeholder="Ex: 5511999999999"
                />
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Este número será usado para todos os botões de consulta do site.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">CNPJ da Empresa</label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                  value={settings.cnpj}
                  onChange={e => setSettings({...settings, cnpj: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Operation Section */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="flex items-center gap-3 text-xl font-black text-slate-900 uppercase tracking-tighter">
              <Clock className="text-blue-600" size={24} /> Horário de Atendimento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Segunda a Sexta</label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                  value={settings.workingHours.weekdays}
                  onChange={e => setSettings({...settings, workingHours: {...settings.workingHours, weekdays: e.target.value}})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sábados e Feriados</label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                  value={settings.workingHours.saturday}
                  onChange={e => setSettings({...settings, workingHours: {...settings.workingHours, saturday: e.target.value}})}
                />
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
