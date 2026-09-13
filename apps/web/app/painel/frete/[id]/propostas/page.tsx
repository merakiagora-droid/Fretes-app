'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
export default function Propostas() {
  const { id } = useParams<{ id:string }>();
  const [props,setProps]=useState<any[]>([]);
  async function carregar() {
    const { data } = await supabase.from('propostas').select('*, users!motorista_id(nome, telefone)').eq('frete_id', id);
    setProps(data ?? []);
  }
  useEffect(()=>{ if (id) carregar(); },[id]);
  async function aceitar(p_id:string) {
    const { error } = await supabase.rpc('aceitar_proposta',{ p_id });
    if (error) return alert(error.message);
    carregar();
  }
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Propostas recebidas</h1>
      {props.length===0 && <p className="text-muted">Sem propostas ainda.</p>}
      <div className="space-y-3">
        {props.map(p=>(
          <div key={p.id} className="bg-white p-5 rounded-lg shadow">
            <p className="font-semibold">{p.users?.nome}</p>
            <p className="text-primary font-bold text-lg">R$ {p.valor}</p>
            {p.mensagem && <p className="text-sm text-muted">{p.mensagem}</p>}
            <p className="text-xs text-muted mt-1">Status: {p.status}</p>
            {p.status==='pendente' && (
              <button onClick={()=>aceitar(p.id)} className="mt-3 bg-ctaAccept text-black font-semibold px-5 py-2 rounded-md">Aceitar</button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
