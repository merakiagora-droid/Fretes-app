import { useState } from 'react';
import { TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { tokens } from '@/lib/theme';
export default function Publicar() {
  const [f,setF]=useState({ origem_cidade:'', origem_uf:'', destino_cidade:'', destino_uf:'',
    tipo_carga:'geral', tipo_veiculo:'carreta', carroceria:'bau', peso_kg:'0', valor_oferecido:'0', data_coleta:'', descricao:'' });
  const router=useRouter();
  async function publicar() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('fretes').insert({
      embarcador_id:user.id, ...f,
      peso_kg:Number(f.peso_kg), valor_oferecido:Number(f.valor_oferecido),
      origem_uf:f.origem_uf.toUpperCase(), destino_uf:f.destino_uf.toUpperCase(),
    });
    if (error) return Alert.alert('Erro', error.message);
    router.back();
  }
  return (
    <ScrollView contentContainerStyle={s.c}>
      <TextInput style={s.input} placeholder="Cidade origem" value={f.origem_cidade} onChangeText={v=>setF({...f,origem_cidade:v})} />
      <TextInput style={s.input} placeholder="UF" maxLength={2} value={f.origem_uf} onChangeText={v=>setF({...f,origem_uf:v})} />
      <TextInput style={s.input} placeholder="Cidade destino" value={f.destino_cidade} onChangeText={v=>setF({...f,destino_cidade:v})} />
      <TextInput style={s.input} placeholder="UF" maxLength={2} value={f.destino_uf} onChangeText={v=>setF({...f,destino_uf:v})} />
      <TextInput style={s.input} placeholder="Tipo carga" value={f.tipo_carga} onChangeText={v=>setF({...f,tipo_carga:v})} />
      <TextInput style={s.input} placeholder="Tipo veículo" value={f.tipo_veiculo} onChangeText={v=>setF({...f,tipo_veiculo:v})} />
      <TextInput style={s.input} placeholder="Carroceria" value={f.carroceria} onChangeText={v=>setF({...f,carroceria:v})} />
      <TextInput style={s.input} placeholder="Peso kg" keyboardType="numeric" value={f.peso_kg} onChangeText={v=>setF({...f,peso_kg:v})} />
      <TextInput style={s.input} placeholder="Valor R$" keyboardType="numeric" value={f.valor_oferecido} onChangeText={v=>setF({...f,valor_oferecido:v})} />
      <TextInput style={s.input} placeholder="Data coleta (YYYY-MM-DD)" value={f.data_coleta} onChangeText={v=>setF({...f,data_coleta:v})} />
      <TextInput style={[s.input,{ height:100 }]} placeholder="Descrição" multiline value={f.descricao} onChangeText={v=>setF({...f,descricao:v})} />
      <TouchableOpacity style={s.btn} onPress={publicar}><Text style={s.btnT}>Publicar</Text></TouchableOpacity>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  c:{ padding:24, backgroundColor:tokens.colors.bg },
  input:{ borderWidth:1, borderColor:tokens.colors.border, borderRadius:tokens.radius.md, padding:16, marginBottom:12, minHeight:tokens.touch, backgroundColor:'#fff' },
  btn:{ backgroundColor:tokens.colors.primary, paddingVertical:20, borderRadius:tokens.radius.md, alignItems:'center', minHeight:tokens.touch, justifyContent:'center' },
  btnT:{ color:'#fff', fontWeight:'700', fontSize:16 },
});
