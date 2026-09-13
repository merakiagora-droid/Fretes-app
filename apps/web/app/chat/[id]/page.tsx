'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import type { Mensagem } from '@/lib/types';
export default function Chat() {
  const { id } = useParams<{ id:string }>();
  const [msgs,setMsgs]=useState<Mensagem[]>([]);
  const [texto,setTexto]=useState(''); const [uid,setUid]=useState('');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{ (async()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUid(user.id);
    const { data } = await supabase.from('mensagens').select('*').eq('conversa_id', id).order('created_at');
    setMsgs((data as Mensagem[]) ?? []);
    const ch = supabase.channel(`msg:${id}`)
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'mensagens', filter:`conversa_id=eq.${id}` },
        payload => setMsgs(m => [...m, payload.new as Mensagem]))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  })(); },[id]);
  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:'smooth' }); },[msgs]);
  async function enviar() {
    if (!texto.trim()) return;
    await supabase.from('mensagens').insert({ conversa_id:id, autor_id:uid, conteudo:texto });
    setTexto('');
  }
  return (
    <main className="max-w-2xl mx-auto p-4 flex flex-col h-screen">
      <h1 className="text-lg font-bold text-primary mb-4">Conversa</h1>
      <div className="flex-1 overflow-y-auto space-y-2 bg-white p-4 rounded-lg">
        {msgs.map(m=>(
          <div key={m.id} className={`max-w-[80%] p-3 rounded-lg ${m.autor_id===uid?'ml-auto bg-primary text-white':'bg-bg'}`}>{m.conteudo}</div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 mt-4">
        <input className="flex-1 border rounded-md px-4 py-3" value={texto} onChange={e=>setTexto(e.target.value)} placeholder="Mensagem" />
        <button onClick={enviar} className="bg-primary text-white px-6 rounded-md">Enviar</button>
      </div>
    </main>
  );
}
