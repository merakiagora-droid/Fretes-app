'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Frete } from '@/lib/types';
import Link from 'next/link';
export default function Painel() {
  const [fretes,setFretes]=useState<Frete[]>([]);
  useEffect(()=>{ (async()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('fretes').select('*').eq('embarcador_id', user.id).order('created_at',{ascending:false});
    setFretes((data as Frete[]) ?? []);
  })(); },[]);
  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Meus fretes</h1>
        <Link href="/painel/novo" className="bg-primary text-white px-5 py-2 rounded-md">+ Novo frete</Link>
      </div>
      {fretes.length===0 && <p className="text-muted">Você ainda não publicou fretes.</p>}
      <div className="space-y-3">
        {fretes.map(f=>(
          <div key={f.id} className="bg-white p-5 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{f.origem_cidade}/{f.origem_uf} → {f.destino_cidade}/{f.destino_uf}</p>
              <p className="text-sm text-muted">{f.status} • {new Date(f.data_coleta).toLocaleDateString('pt-BR')}</p>
            </div>
            <Link href={`/painel/frete/${f.id}/propostas`} className="text-primary hover:underline">Ver propostas</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
