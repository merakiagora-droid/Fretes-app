'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
export default function OnboardingMotorista() {
  const [cnh,setCnh]=useState(''); const [cidade,setCidade]=useState('');
  const [uf,setUf]=useState(''); const [raio,setRaio]=useState(150);
  const [tipoV,setTipoV]=useState('carreta'); const [carroc,setCarroc]=useState('bau');
  const [placa,setPlaca]=useState(''); const [cap,setCap]=useState(25000);
  const [msg,setMsg]=useState(''); const router=useRouter();
  async function salvar() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error: e1 } = await supabase.from('motoristas').upsert({ user_id:user.id, cnh, cidade_base:cidade, uf_base:uf.toUpperCase(), raio_atuacao_km:raio });
    if (e1) return setMsg(e1.message);
    const { error: e2 } = await supabase.from('veiculos').insert({ motorista_id:user.id, tipo:tipoV, carroceria:carroc, placa, capacidade_kg:cap });
    if (e2) return setMsg(e2.message);
    router.push('/fretes');
  }
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow space-y-4">
        <h1 className="text-2xl font-bold text-primary">Perfil do motorista</h1>
        <input className="w-full border rounded-md px-4 py-3" placeholder="CNH" value={cnh} onChange={e=>setCnh(e.target.value)} />
        <div className="grid grid-cols-3 gap-2">
          <input className="col-span-2 border rounded-md px-4 py-3" placeholder="Cidade base" value={cidade} onChange={e=>setCidade(e.target.value)} />
          <input className="border rounded-md px-4 py-3" placeholder="UF" maxLength={2} value={uf} onChange={e=>setUf(e.target.value)} />
        </div>
        <input className="w-full border rounded-md px-4 py-3" type="number" placeholder="Raio (km)" value={raio} onChange={e=>setRaio(Number(e.target.value))} />
        <div className="grid grid-cols-2 gap-2">
          <select className="border rounded-md px-4 py-3" value={tipoV} onChange={e=>setTipoV(e.target.value)}>
            <option value="vuc">VUC</option><option value="3/4">3/4</option>
            <option value="toco">Toco</option><option value="truck">Truck</option><option value="carreta">Carreta</option>
          </select>
          <select className="border rounded-md px-4 py-3" value={carroc} onChange={e=>setCarroc(e.target.value)}>
            <option value="bau">Baú</option><option value="sider">Sider</option>
            <option value="graneleiro">Graneleiro</option><option value="prancha">Prancha</option><option value="tanque">Tanque</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input className="border rounded-md px-4 py-3" placeholder="Placa" value={placa} onChange={e=>setPlaca(e.target.value)} />
          <input className="border rounded-md px-4 py-3" type="number" placeholder="Capacidade kg" value={cap} onChange={e=>setCap(Number(e.target.value))} />
        </div>
        <button onClick={salvar} className="w-full bg-primary text-white py-3 rounded-md">Salvar e continuar</button>
        {msg && <p className="text-sm text-ctaAlert">{msg}</p>}
      </div>
    </main>
  );
}
