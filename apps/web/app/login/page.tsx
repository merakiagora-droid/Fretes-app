'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
export default function Login() {
  const [modo,setModo]=useState<'email'|'otp'>('email');
  const [email,setEmail]=useState(''); const [senha,setSenha]=useState('');
  const [telefone,setTelefone]=useState(''); const [token,setToken]=useState('');
  const [msg,setMsg]=useState(''); const router=useRouter();
  async function entrarEmail() {
    const { error } = await supabase.auth.signInWithPassword({ email, password:senha });
    if (error) return setMsg(error.message);
    router.push('/fretes');
  }
  async function enviarOtp() {
    const { error } = await supabase.auth.signInWithOtp({ phone:telefone });
    setMsg(error ? error.message : 'Código enviado');
  }
  async function verificarOtp() {
    const { error } = await supabase.auth.verifyOtp({ phone:telefone, token, type:'sms' });
    if (error) return setMsg(error.message);
    router.push('/fretes');
  }
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-primary mb-6">Entrar</h1>
        <div className="flex gap-2 mb-6">
          <button onClick={()=>setModo('email')} className={`flex-1 py-2 rounded-md ${modo==='email'?'bg-primary text-white':'border'}`}>E-mail</button>
          <button onClick={()=>setModo('otp')} className={`flex-1 py-2 rounded-md ${modo==='otp'?'bg-primary text-white':'border'}`}>Telefone</button>
        </div>
        {modo==='email' ? (
          <div className="space-y-4">
            <input className="w-full border rounded-md px-4 py-3" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="w-full border rounded-md px-4 py-3" placeholder="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} />
            <button onClick={entrarEmail} className="w-full bg-primary text-white py-3 rounded-md">Entrar</button>
          </div>
        ) : (
          <div className="space-y-4">
            <input className="w-full border rounded-md px-4 py-3" placeholder="+55 11 99999-0000" value={telefone} onChange={e=>setTelefone(e.target.value)} />
            <button onClick={enviarOtp} className="w-full bg-primary text-white py-3 rounded-md">Enviar código</button>
            <input className="w-full border rounded-md px-4 py-3" placeholder="Código SMS" value={token} onChange={e=>setToken(e.target.value)} />
            <button onClick={verificarOtp} className="w-full bg-ctaAccept text-black font-semibold py-3 rounded-md">Verificar</button>
          </div>
        )}
        {msg && <p className="mt-4 text-sm text-ctaAlert">{msg}</p>}
      </div>
    </main>
  );
}
