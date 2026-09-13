'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
export default function Perfil() {
  const [u,setU]=useState<any>(null); const [avals,setAvals]=useState<any[]>([]);
  useEffect(()=>{ (async()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
    setU(data);
    const { data: a } = await supabase.from('avaliacoes').select('*, users!avaliador_id(nome)').eq('avaliado_id', user.id);
    setAvals(a ?? []);
  })(); },[]);
  if (!u) return <p className="p-6">Carregando...</p>;
  const media = avals.length ? (avals.reduce((s,a)=>s+a.nota,0)/avals.length).toFixed(1) : '—';
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary mb-2">{u.nome}</h1>
      <p className="text-muted">{u.tipo} • {u.email ?? u.telefone}</p>
      <p className="mt-2">Reputação: <b>{media}</b> ({avals.length} avaliações)</p>
      <div className="mt-6 space-y-2">
        {avals.map(a=>(
          <div key={a.id} className="bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">{a.users?.nome}</p>
            <p>{'★'.repeat(a.nota)}{'☆'.repeat(5-a.nota)}</p>
            {a.comentario && <p className="text-sm text-muted">{a.comentario}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
