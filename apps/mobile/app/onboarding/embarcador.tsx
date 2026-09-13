import { useState } from 'react';
import { TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { tokens } from '@/lib/theme';
export default function OnboardingEmbarcador() {
  const [rs,setRs]=useState(''); const [nf,setNf]=useState('');
  const [seg,setSeg]=useState('geral'); const [end,setEnd]=useState('');
  const router=useRouter();
  async function salvar() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('embarcadores').upsert({ user_id:user.id, razao_social:rs, nome_fantasia:nf, segmento:seg, endereco:end });
    if (error) return Alert.alert('Erro', error.message);
    router.replace('/(tabs)/meus-fretes');
  }
  return (
    <ScrollView contentContainerStyle={s.c}>
      <Text style={s.title}>Perfil do embarcador</Text>
      <TextInput style={s.input} placeholder="Razão social" value={rs} onChangeText={setRs} />
      <TextInput style={s.input} placeholder="Nome fantasia" value={nf} onChangeText={setNf} />
      <TextInput style={s.input} placeholder="Segmento" value={seg} onChangeText={setSeg} />
      <TextInput style={s.input} placeholder="Endereço" value={end} onChangeText={setEnd} />
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
