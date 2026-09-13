import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/lib/theme';
export default function FreteDetalhe() {
  const { id } = useLocalSearchParams<{ id:string }>();
  const [frete,setFrete]=useState<any>(null);
  const [valor,setValor]=useState(''); const [msg,setMsg]=useState('');
  const router=useRouter();
  useEffect(()=>{ if (!id) return; supabase.from('fretes').select('*').eq('id', id).single().then(({data})=>setFrete(data)); },[id]);
  async function enviar() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('propostas').insert({ frete_id:id, motorista_id:user.id, valor:Number(valor), mensagem:msg });
    if (error) return Alert.alert('Erro', error.message);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Proposta enviada!');
    router.back();
  }
  if (!frete) return <View style={s.c}><Text>Carregando...</Text></View>;
  return (
    <ScrollView contentContainerStyle={s.c}>
      <Text style={s.route}>{frete.origem_cidade}/{frete.origem_uf} → {frete.destino_cidade}/{frete.destino_uf}</Text>
      <Text style={s.sub}>{frete.tipo_carga} • {frete.tipo_veiculo} • {frete.carroceria} • {frete.peso_kg}kg</Text>
      <Text style={s.sub}>Coleta: {frete.data_coleta}</Text>
      <TextInput style={s.input} placeholder="Valor R$" keyboardType="numeric" value={valor} onChangeText={setValor} />
      <TextInput style={[s.input,{ height:100 }]} placeholder="Mensagem" multiline value={msg} onChangeText={setMsg} />
      <TouchableOpacity style={s.btn} onPress={enviar}><Text style={s.btnT}>Enviar proposta</Text></TouchableOpacity>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  c:{ padding:24, backgroundColor:tokens.colors.bg },
  route:{ fontSize:22, fontWeight:'700', color:tokens.colors.primary },
  sub:{ color:tokens.colors.muted, marginTop:6 },
  input:{ borderWidth:1, borderColor:tokens.colors.border, borderRadius:tokens.radius.md, padding:16, marginTop:16, minHeight:tokens.touch, backgroundColor:'#fff' },
  btn:{ marginTop:24, backgroundColor:tokens.colors.ctaAccept, paddingVertical:20, borderRadius:tokens.radius.md, alignItems:'center', minHeight:tokens.touch, justifyContent:'center' },
  btnT:{ color:'#000', fontWeight:'700', fontSize:16 },
});
