import { useState } from 'react';
import { TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { tokens } from '@/lib/theme';
export default function OnboardingMotorista() {
  const [cnh,setCnh]=useState(''); const [cidade,setCidade]=useState('');
  const [uf,setUf]=useState(''); const [raio,setRaio]=useState('150');
  const [tipoV,setTipoV]=useState('carreta'); const [carroc,setCarroc]=useState('bau');
  const [placa,setPlaca]=useState(''); const [cap,setCap]=useState('25000');
  const router=useRouter();
  async function salvar() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error: e1 } = await supabase.from('motoristas').upsert({ user_id:user.id, cnh, cidade_base:cidade, uf_base:uf.toUpperCase(), raio_atuacao_km:Number(raio) });
    if (e1) return Alert.alert('Erro', e1.message);
    const { error: e2 } = await supabase.from('veiculos').insert({ motorista_id:user.id, tipo:tipoV, carroceria:carroc, placa, capacidade_kg:Number(cap) });
    if (e2) return Alert.alert('Erro', e2.message);
    router.replace('/(tabs)/buscar');
  }
  return (
    <ScrollView contentContainerStyle={s.c}>
      <Text style={s.title}>Perfil do motorista</Text>
      <TextInput style={s.input} placeholder="CNH" value={cnh} onChangeText={setCnh} />
      <TextInput style={s.input} placeholder="Cidade base" value={cidade} onChangeText={setCidade} />
      <TextInput style={s.input} placeholder="UF" maxLength={2} value={uf} onChangeText={setUf} />
      <TextInput style={s.input} placeholder="Raio (km)" keyboardType="number-pad" value={raio} onChangeText={setRaio} />
      <TextInput style={s.input} placeholder="Tipo veículo" value={tipoV} onChangeText={setTipoV} />
      <TextInput style={s.input} placeholder="Carroceria" value={carroc} onChangeText={setCarroc} />
      <TextInput style={s.input} placeholder="Placa" value={placa} onChangeText={setPlaca} />
      <TextInput style={s.input} placeholder="Capacidade kg" keyboardType="number-pad" value={cap} onChangeText={setCap} />
      <TouchableOpacity style={s.btn} onPress={salvar}><Text style={s.btnT}>Salvar</Text></TouchableOpacity>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  c:{ padding:24, backgroundColor:tokens.colors.bg },
  title:{ fontSize:24, fontWeight:'700', color:tokens.colors.primary, marginBottom:16 },
  input:{ borderWidth:1, borderColor:tokens.colors.border, borderRadius:tokens.radius.md, padding:16, marginBottom:12, minHeight:tokens.touch, backgroundColor:'#fff' },
  btn:{ backgroundColor:tokens.colors.primary, paddingVertical:18, borderRadius:tokens.radius.md, alignItems:'center', minHeight:tokens.touch, justifyContent:'center' },
  btnT:{ color:'#fff', fontWeight:'700' },
});
