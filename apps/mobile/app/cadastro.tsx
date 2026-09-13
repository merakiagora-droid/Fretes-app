import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { tokens } from '@/lib/theme';
export default function Cadastro() {
  const [tipo,setTipo]=useState<'motorista'|'embarcador'|null>(null);
  const [nome,setNome]=useState(''); const [email,setEmail]=useState('');
  const [senha,setSenha]=useState(''); const [doc,setDoc]=useState('');
  const router=useRouter();
  async function criar() {
    if (!tipo) return Alert.alert('Escolha o tipo');
    const { data, error } = await supabase.auth.signUp({ email, password:senha });
    if (error || !data.user) return Alert.alert('Erro', error?.message ?? 'erro');
    const { error: e2 } = await supabase.from('users').insert({ id:data.user.id, tipo, nome, email, cpf_cnpj:doc });
    if (e2) return Alert.alert('Erro', e2.message);
    router.replace(tipo==='motorista'?'/onboarding/motorista':'/onboarding/embarcador');
  }
  return (
    <View style={s.container}>
      <Text style={s.title}>Criar conta</Text>
      <View style={s.row}>
        <TouchableOpacity style={[s.opt, tipo==='motorista'&&s.optOn]} onPress={()=>setTipo('motorista')}><Text style={[s.optT, tipo==='motorista'&&s.optTOn]}>Motorista</Text></TouchableOpacity>
        <TouchableOpacity style={[s.opt, tipo==='embarcador'&&s.optOn]} onPress={()=>setTipo('embarcador')}><Text style={[s.optT, tipo==='embarcador'&&s.optTOn]}>Embarcador</Text></TouchableOpacity>
      </View>
      <TextInput style={s.input} placeholder="Nome / Razão social" value={nome} onChangeText={setNome} />
      <TextInput style={s.input} placeholder="CPF ou CNPJ" value={doc} onChangeText={setDoc} keyboardType="numeric" />
      <TextInput style={s.input} placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={s.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
      <TouchableOpacity style={s.btn} onPress={criar}><Text style={s.btnT}>Criar</Text></TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  container:{ flex:1, padding:24, justifyContent:'center', backgroundColor:tokens.colors.bg },
  title:{ fontSize:26, fontWeight:'700', color:tokens.colors.primary, marginBottom:24 },
  row:{ flexDirection:'row', gap:8, marginBottom:16 },
  opt:{ flex:1, paddingVertical:18, borderRadius:tokens.radius.md, borderWidth:1, borderColor:tokens.colors.border, alignItems:'center', minHeight:tokens.touch },
  optOn:{ backgroundColor:tokens.colors.primary },
  optT:{ fontWeight:'600', color:tokens.colors.text },
  optTOn:{ color:'#fff' },
  input:{ borderWidth:1, borderColor:tokens.colors.border, borderRadius:tokens.radius.md, padding:16, marginBottom:12, minHeight:tokens.touch, backgroundColor:'#fff' },
  btn:{ backgroundColor:tokens.colors.primary, paddingVertical:18, borderRadius:tokens.radius.md, alignItems:'center', minHeight:tokens.touch, justifyContent:'center' },
  btnT:{ color:'#fff', fontWeight:'700' },
});
