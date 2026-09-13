'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
export default function ChatList() {
  const [items,setItems]=useState<any[]>([]);
  useEffect(()=>{ (async()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('conversas')
      .select('*, fretes(origem_cidade,origem_uf,destino_cidade,destino_uf)')
      .or(`embarcador_id.eq.${user.id},motorista_id.eq.${user.id}`);
    setItems(data ?? []);
  })(); },[]);
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Conversas</h1>
      {items.length===0 && <p className="text-muted">Nenhuma conversa.</p>}
      <div className="space-y-2">
        {items.map(c=>(
          <Link key={c.id} href={`/chat/${c.id}`} className="block bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">{c.fretes?.origem_cidade}/{c.fretes?.origem_uf} → {c.fretes?.destino_cidade}/{c.fretes?.destino_uf}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
