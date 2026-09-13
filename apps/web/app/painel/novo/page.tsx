'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
export default function NovoFrete() {
  const [f,setF]=useState({ origem_cidade:'', origem_uf:'', destino_cidade:'', destino_uf:'',
    tipo_carga:'geral', tipo_veiculo:'carreta', carroceria:'bau',
    peso_kg:0, valor_oferecido:0, data_coleta:'', descricao:'' });
  const [erro,setErro]=useState(''); const router=useRouter();
  async function publicar() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setErro('Faça login');
    const { error } = await supabase.from('fretes').insert({
      embarcador_id: user.id, ...f,
      origem_uf: f.origem_uf.toUpperCase(), destino_uf: f.destino_uf.toUpperCase(),
    });
    if (error) return setErro(error.message);
    router.push('/painel');
  }
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Publicar frete</h1>
      <div className="bg-white p-6 rounded-lg shadow space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <input className="col-span-2 border rounded-md px-4 py-3" placeholder="Cidade origem" value={f.origem_cidade} onChange={e=>setF({...f,origem_cidade:e.target.value})} />
          <input className="border rounded-md px-4 py-3" placeholder="UF" maxLength={2} value={f.origem_uf} onChange={e=>setF({...f,origem_uf:e.target.value})} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input className="col-span-2 border rounded-md px-4 py-3" placeholder="Cidade destino" value={f.destino_cidade} onChange={e=>setF({...f,destino_cidade:e.target.value})} />
          <input className="border rounded-md px-4 py-3" placeholder="UF" maxLength={2} value={f.destino_uf} onChange={e=>setF({...f,destino_uf:e.target.value})} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input className="border rounded-md px-4 py-3" placeholder="Tipo de carga" value={f.tipo_carga} onChange={e=>setF({...f,tipo_carga:e.target.value})} />
          <select className="border rounded-md px-4 py-3" value={f.tipo_veiculo} onChange={e=>setF({...f,tipo_veiculo:e.target.value})}>
            <option value="vuc">VUC</option><option value="3/4">3/4</option><option value="toco">Toco</option><option value="truck">Truck</option><option value="carreta">Carreta</option>
          </select>
          <select className="border rounded-md px-4 py-3" value={f.carroceria} onChange={e=>setF({...f,carroceria:e.target.value})}>
            <option value="bau">Baú</option><option value="sider">Sider</option><option value="graneleiro">Graneleiro</option><option value="prancha">Prancha</option><option value="tanque">Tanque</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input className="border rounded-md px-4 py-3" type="number" placeholder="Peso kg" value={f.peso_kg} onChange={e=>setF({...f,peso_kg:Number(e.target.value)})} />
          <input className="border rounded-md px-4 py-3" type="number" placeholder="Valor R$" value={f.valor_oferecido} onChange={e=>setF({...f,valor_oferecido:Number(e.target.value)})} />
          <input className="border rounded-md px-4 py-3" type="date" value={f.data_coleta} onChange={e=>setF({...f,data_coleta:e.target.value})} />
        </div>
        <textarea className="w-full border rounded-md px-4 py-3" placeholder="Descrição" value={f.descricao} onChange={e=>setF({...f,descricao:e.target.value})} />
        <button onClick={publicar} className="w-full bg-primary text-white py-3 rounded-md">Publicar</button>
        {erro && <p className="text-ctaAlert text-sm">{erro}</p>}
      </div>
    </main>
  );
}
