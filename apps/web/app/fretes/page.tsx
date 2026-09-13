'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Frete } from '@/lib/types';
import Link from 'next/link';
const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
export default function Fretes() {
  const [fretes,setFretes]=useState<Frete[]>([]);
  const [loading,setLoading]=useState(true);
  const [f,setF]=useState({ origem_uf:'', destino_uf:'', tipo_veiculo:'', carroceria:'', data_de:'' });
  async function buscar() {
    setLoading(true);
    let q = supabase.from('fretes').select('*').eq('status','aberto').order('data_coleta').limit(50);
    if (f.origem_uf) q = q.eq('origem_uf', f.origem_uf);
    if (f.destino_uf) q = q.eq('destino_uf', f.destino_uf);
    if (f.tipo_veiculo) q = q.eq('tipo_veiculo', f.tipo_veiculo);
    if (f.carroceria) q = q.eq('carroceria', f.carroceria);
    if (f.data_de) q = q.gte('data_coleta', f.data_de);
    const { data } = await q;
    setFretes((data as Frete[]) ?? []);
    setLoading(false);
  }
  useEffect(()=>{ buscar(); },[]);
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">Buscar fretes</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        <select className="border rounded-md px-3 py-2" value={f.origem_uf} onChange={e=>setF({...f,origem_uf:e.target.value})}>
          <option value="">Origem UF</option>{UFS.map(u=><option key={u}>{u}</option>)}
        </select>
        <select className="border rounded-md px-3 py-2" value={f.destino_uf} onChange={e=>setF({...f,destino_uf:e.target.value})}>
          <option value="">Destino UF</option>{UFS.map(u=><option key={u}>{u}</option>)}
        </select>
        <select className="border rounded-md px-3 py-2" value={f.tipo_veiculo} onChange={e=>setF({...f,tipo_veiculo:e.target.value})}>
          <option value="">Veículo</option><option>vuc</option><option>3/4</option><option>toco</option><option>truck</option><option>carreta</option>
        </select>
        <select className="border rounded-md px-3 py-2" value={f.carroceria} onChange={e=>setF({...f,carroceria:e.target.value})}>
          <option value="">Carroceria</option><option>bau</option><option>sider</option><option>graneleiro</option><option>prancha</option><option>tanque</option>
        </select>
        <input type="date" className="border rounded-md px-3 py-2" value={f.data_de} onChange={e=>setF({...f,data_de:e.target.value})} />
      </div>
      <button onClick={buscar} className="bg-primary text-white px-6 py-2 rounded-md mb-6">Buscar</button>
      {loading && <p>Carregando...</p>}
      {!loading && fretes.length===0 && <p className="text-muted">Nenhum frete encontrado.</p>}
      <div className="space-y-3">
        {fretes.map(fr => (
          <Link key={fr.id} href={`/fretes/${fr.id}`} className="block bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg">{fr.origem_cidade}/{fr.origem_uf} → {fr.destino_cidade}/{fr.destino_uf}</p>
                <p className="text-sm text-muted">{fr.tipo_carga} • {fr.tipo_veiculo} • {fr.carroceria} • {fr.peso_kg}kg</p>
                <p className="text-sm text-muted">Coleta: {new Date(fr.data_coleta).toLocaleDateString('pt-BR')}</p>
              </div>
              <span className="text-primary font-bold text-lg">{fr.valor_oferecido ? `R$ ${Number(fr.valor_oferecido).toLocaleString('pt-BR')}` : 'A combinar'}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
