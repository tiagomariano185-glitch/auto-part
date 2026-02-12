
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Save, 
  ChevronLeft, 
  Globe, 
  Phone, 
  MapPin, 
  Shield, 
  Clock,
  CheckCircle2
} from 'lucide-react';
import { mockDb } from '../../services/mockDb';
import { SiteSettings as SiteSettingsType } from '../../types';

export const SiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettingsType>(mockDb.getSettings());
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = mockDb.getAuth();
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configurações do Site</h1>
              <p className="text-sm text-slate-500 font-medium">Altere o nome, contatos e informações gerais do site.</p>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            className="bg-orange-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg active:scale-95"
          >
            {saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
            {saved ? 'Salvo!' : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Branding Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 border-b border-slate-100 pb-4">
              <Globe className="text-orange-600" size={20} /> Identidade Visual
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome do Site / Empresa</label>
                <input 
                  type="text" 
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                  value={settings.name}
                  onChange={e => setSettings({...settings, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Slogan / Subtexto</label>
                <input 
                  type="text" 
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                  value={settings.subtext}
                  onChange={e => setSettings({...settings, subtext: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 border-b border-slate-100 pb-4">
              <Phone className="text-green-600" size={20} /> Canais de Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">WhatsApp (com DDD)</label>
                <input 
                  type="text" 
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                  value={settings.whatsapp}
                  onChange={e => setSettings({...settings, whatsapp: e.target.value})}
                  placeholder="5511999999999"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CNPJ</label>
                <input 
                  type="text" 
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                  value={settings.cnpj}
                  onChange={e => setSettings({...settings, cnpj: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Operation Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 border-b border-slate-100 pb-4">
              <Clock className="text-blue-600" size={20} /> Horários de Funcionamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Segunda a Sexta</label>
                <input 
                  type="text" 
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                  value={settings.workingHours.weekdays}
                  onChange={e => setSettings({...settings, workingHours: {...settings.workingHours, weekdays: e.target.value}})}
                  placeholder="08:00 às 18:00"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sábados</label>
                <input 
                  type="text" 
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500 font-bold"
                  value={settings.workingHours.saturday}
                  onChange={e => setSettings({...settings, workingHours: {...settings.workingHours, saturday: e.target.value}})}
                  placeholder="08:00 às 12:00"
                />
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};