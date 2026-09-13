'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import type { Frete } from '@/lib/types';
export default function DetalheFrete() {
  const { id } = useParams<{ id:string }>();
  const [frete,setFrete]=useState<Frete|null>(null);
  const [valor,setValor]=useState(''); const [msg,setMsg]=useState('');
  const [erro,setErro]=useState(''); const [ok,setOk]=useState(false);
  useEffect(()=>{ if (!id) return; supabase.from('fretes').select('*').eq('id', id).single().then(({data})=>setFrete(data as Frete)); },[id]);
  async function enviarProposta() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setErro('Faça login');
    const { error } = await supabase.from('propostas').insert({ frete_id:id, motorista_id:user.id, valor:Number(valor), mensagem:msg });
    if (error) return setErro(error.message);
    setOk(true);
  }
  if (!frete) return <p className="p-6">Carregando...</p>;
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary">{frete.origem_cidade}/{frete.origem_uf} → {frete.destino_cidade}/{frete.destino_uf}</h1>
      <div className="bg-white p-6 rounded-lg shadow mt-6 space-y-2">
        <p><b>Carga:</b> {frete.tipo_carga}</p>
        <p><b>Veículo:</b> {frete.tipo_veiculo} / {frete.carroceria}</p>
        <p><b>Peso:</b> {frete.peso_kg} kg</p>
        <p><b>Coleta:</b> {new Date(frete.data_coleta).toLocaleDateString('pt-BR')}</p>
        <p><b>Valor oferecido:</b> {frete.valor_oferecido ? `R$ ${frete.valor_oferecido}` : 'A combinar'}</p>
        {frete.descricao && <p className="text-muted">{frete.descricao}</p>}
      </div>
      <div className="mt-6 bg-white p-6 rounded-lg shadow space-y-3">
        <h2 className="font-semibold text-lg">Enviar proposta</h2>
        <input className="w-full border rounded-md px-4 py-3" placeholder="Valor (R$)" value={valor} onChange={e=>setValor(e.target.value)} />
        <textarea className="w-full border rounded-md px-4 py-3" placeholder="Mensagem" value={msg} onChange={e=>setMsg(e.target.value)} />
        <button onClick={enviarProposta} className="bg-ctaAccept text-black font-semibold px-6 py-3 rounded-md w-full">Enviar proposta</button>
        {erro && <p className="text-ctaAlert text-sm">{erro}</p>}
        {ok && <p className="text-ctaAccept text-sm">Proposta enviada!</p>}
      </div>
    </main>
  );
}
