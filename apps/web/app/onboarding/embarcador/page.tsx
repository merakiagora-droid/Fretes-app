'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
export default function OnboardingEmbarcador() {
  const [rs,setRs]=useState(''); const [nf,setNf]=useState('');
  const [seg,setSeg]=useState('geral'); const [end,setEnd]=useState('');
  const [msg,setMsg]=useState(''); const router=useRouter();
  async function salvar() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('embarcadores').upsert({ user_id:user.id, razao_social:rs, nome_fantasia:nf, segmento:seg, endereco:end });
    if (error) return setMsg(error.message);
    router.push('/painel');
  }
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow space-y-4">
        <h1 className="text-2xl font-bold text-primary">Perfil do embarcador</h1>
        <input className="w-full border rounded-md px-4 py-3" placeholder="Razão social" value={rs} onChange={e=>setRs(e.target.value)} />
        <input className="w-full border rounded-md px-4 py-3" placeholder="Nome fantasia" value={nf} onChange={e=>setNf(e.target.value)} />
        <select className="w-full border rounded-md px-4 py-3" value={seg} onChange={e=>setSeg(e.target.value)}>
          <option value="geral">Geral</option><option value="refrigerada">Refrigerada</option>
          <option value="granel">Granel</option><option value="perigosa">Perigosa</option>
        </select>
        <input className="w-full border rounded-md px-4 py-3" placeholder="Endereço" value={end} onChange={e=>setEnd(e.target.value)} />
        <button onClick={salvar} className="w-full bg-primary text-white py-3 rounded-md">Salvar</button>
        {msg && <p className="text-sm text-ctaAlert">{msg}</p>}
      </div>
    </main>
  );
}
