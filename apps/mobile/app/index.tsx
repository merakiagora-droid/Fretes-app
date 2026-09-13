import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { tokens } from '@/lib/theme';
export default function Login() {
  const [email,setEmail]=useState(''); const [senha,setSenha]=useState('');
  const [telefone,setTelefone]=useState(''); const [token,setToken]=useState('');
  const [modo,setModo]=useState<'email'|'otp'>('email');
  const router=useRouter();
  async function entrar() {
    if (modo==='email') {
      const { error } = await supabase.auth.signInWithPassword({ email, password:senha });
      if (error) return Alert.alert('Erro', error.message);
      router.replace('/(tabs)/buscar');
    } else {
      if (!token) {
        const { error } = await supabase.auth.signInWithOtp({ phone:telefone });
        if (error) return Alert.alert('Erro', error.message);
        return Alert.alert('OK','Código enviado');
      }
      const { error } = await supabase.auth.verifyOtp({ phone:telefone, token, type:'sms' });
      if (error) return Alert.alert('Erro', error.message);
      router.replace('/(tabs)/buscar');
    }
  }
  return (
    <View style={s.container}>
      <Text style={s.title}>FretesApp</Text>
      <View style={s.tabs}>
        <TouchableOpacity style={[s.tab, modo==='email'&&s.tabOn]} onPress={()=>setModo('email')}><Text style={[s.tabT, modo==='email'&&s.tabTOn]}>E-mail</Text></TouchableOpacity>
        <TouchableOpacity style={[s.tab, modo==='otp'&&s.tabOn]} onPress={()=>setModo('otp')}><Text style={[s.tabT, modo==='otp'&&s.tabTOn]}>Telefone</Text></TouchableOpacity>
      </View>
      {modo==='email' ? (<>
        <TextInput style={s.input} placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={s.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
      </>) : (<>
        <TextInput style={s.input} placeholder="+55 11 99999-0000" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
        <TextInput style={s.input} placeholder="Código SMS" value={token} onChangeText={setToken} keyboardType="number-pad" />
      </>)}
      <TouchableOpacity style={s.btn} onPress={entrar}><Text style={s.btnT}>{modo==='email'?'Entrar':(token?'Verificar':'Enviar código')}</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>router.push('/cadastro')}><Text style={s.link}>Criar conta</Text></TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  container:{ flex:1, padding:24, justifyContent:'center', backgroundColor:tokens.colors.bg },
  title:{ fontSize:30, fontWeight:'700', color:tokens.colors.primary, textAlign:'center', marginBottom:32 },
  tabs:{ flexDirection:'row', gap:8, marginBottom:16 },
  tab:{ flex:1, paddingVertical:14, borderRadius:tokens.radius.md, borderWidth:1, borderColor:tokens.colors.border, alignItems:'center', minHeight:tokens.touch },
  tabOn:{ backgroundColor:tokens.colors.primary, borderColor:tokens.colors.primary },
  tabT:{ color:tokens.colors.text, fontWeight:'600' },
  tabTOn:{ color:'#fff' },
  input:{ borderWidth:1, borderColor:tokens.colors.border, borderRadius:tokens.radius.md, paddingHorizontal:16, paddingVertical:16, marginBottom:12, minHeight:tokens.touch, fontSize:16, backgroundColor:'#fff' },
  btn:{ backgroundColor:tokens.colors.primary, paddingVertical:18, borderRadius:tokens.radius.md, alignItems:'center', minHeight:tokens.touch, justifyContent:'center' },
  btnT:{ color:'#fff', fontWeight:'700', fontSize:16 },
  link:{ textAlign:'center', marginTop:16, color:tokens.colors.primary, fontWeight:'600' },
});
