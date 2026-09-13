'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
export default function Cadastro() {
  const [tipo,setTipo]=useState<'motorista'|'embarcador'|null>(null);
  const [nome,setNome]=useState(''); const [email,setEmail]=useState('');
  const [senha,setSenha]=useState(''); const [doc,setDoc]=useState('');
  const [msg,setMsg]=useState(''); const router=useRouter();
  async function criar() {
    if (!tipo) return setMsg('Escolha o tipo');
    const { data, error } = await supabase.auth.signUp({ email, password:senha });
    if (error || !data.user) return setMsg(error?.message ?? 'erro');
    const { error: e2 } = await supabase.from('users').insert({ id:data.user.id, tipo, nome, email, cpf_cnpj:doc });
    if (e2) return setMsg(e2.message);
    router.push(tipo==='motorista'?'/onboarding/motorista':'/onboarding/embarcador');
  }
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow space-y-4">
        <h1 className="text-2xl font-bold text-primary">Criar conta</h1>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={()=>setTipo('motorista')} className={`py-3 rounded-md ${tipo==='motorista'?'bg-primary text-white':'border'}`}>Motorista</button>
          <button onClick={()=>setTipo('embarcador')} className={`py-3 rounded-md ${tipo==='embarcador'?'bg-primary text-white':'border'}`}>Embarcador</button>
        </div>
        <input className="w-full border rounded-md px-4 py-3" placeholder="Nome / Razão social" value={nome} onChange={e=>setNome(e.target.value)} />
        <input className="w-full border rounded-md px-4 py-3" placeholder="CPF ou CNPJ" value={doc} onChange={e=>setDoc(e.target.value)} />
        <input className="w-full border rounded-md px-4 py-3" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded-md px-4 py-3" placeholder="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} />
        <button onClick={criar} className="w-full bg-primary text-white py-3 rounded-md">Criar conta</button>
        {msg && <p className="text-sm text-ctaAlert">{msg}</p>}
      </div>
    </main>
  );
}
