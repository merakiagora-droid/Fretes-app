import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { tokens } from '@/lib/theme';
export default function Perfil() {
  const [u,setU]=useState<any>(null); const [media,setMedia]=useState('—');
  const router=useRouter();
  useEffect(()=>{ (async()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
    setU(data);
    const { data: a } = await supabase.from('avaliacoes').select('nota').eq('avaliado_id', user.id);
    if (a && a.length) setMedia((a.reduce((s:number,x:any)=>s+x.nota,0)/a.length).toFixed(1));
  })(); },[]);
  async function sair() { await supabase.auth.signOut(); router.replace('/'); }
  if (!u) return <View style={s.c}><Text>Carregando...</Text></View>;
  return (
    <View style={s.c}>
      <Text style={s.name}>{u.nome}</Text>
      <Text style={s.sub}>{u.tipo} • {u.email ?? u.telefone}</Text>
      <Text style={s.rep}>Reputação: {media}</Text>
      <TouchableOpacity style={s.btn} onPress={sair}><Text style={s.btnT}>Sair</Text></TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  c:{ flex:1, padding:24, backgroundColor:tokens.colors.bg },
  name:{ fontSize:26, fontWeight:'700', color:tokens.colors.primary },
  sub:{ color:tokens.colors.muted, marginTop:4 },
  rep:{ marginTop:12, fontSize:16 },
  btn:{ marginTop:32, borderWidth:1, borderColor:tokens.colors.ctaAlert, padding:16, borderRadius:tokens.radius.md, alignItems:'center', minHeight:tokens.touch, justifyContent:'center' },
  btnT:{ color:tokens.colors.ctaAlert, fontWeight:'700' },
});
