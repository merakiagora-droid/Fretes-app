import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/lib/theme';
export default function Chat() {
  const { id } = useLocalSearchParams<{ id:string }>();
  const [msgs,setMsgs]=useState<any[]>([]);
  const [texto,setTexto]=useState(''); const [uid,setUid]=useState('');
  const listRef=useRef<FlatList>(null);
  useEffect(()=>{ (async()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUid(user.id);
    const { data } = await supabase.from('mensagens').select('*').eq('conversa_id', id).order('created_at');
    setMsgs(data ?? []);
    const ch = supabase.channel(`msg:${id}`)
      .on('postgres_changes',{ event:'INSERT', schema:'public', table:'mensagens', filter:`conversa_id=eq.${id}` },
        payload => { setMsgs(m=>[...m,payload.new]); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  })(); },[id]);
  async function enviar() {
    if (!texto.trim()) return;
    await supabase.from('mensagens').insert({ conversa_id:id, autor_id:uid, conteudo:texto });
    setTexto('');
  }
  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':undefined}>
      <FlatList ref={listRef} contentContainerStyle={{ padding:16 }} data={msgs} keyExtractor={i=>i.id}
        onContentSizeChange={()=>listRef.current?.scrollToEnd()}
        renderItem={({item})=>(
          <View style={[s.bubble, item.autor_id===uid?s.me:s.other]}>
            <Text style={{ color:item.autor_id===uid?'#fff':'#000' }}>{item.conteudo}</Text>
          </View>
        )}
      />
      <View style={s.inputRow}>
        <TextInput style={s.input} value={texto} onChangeText={setTexto} placeholder="Mensagem" />
        <TouchableOpacity style={s.btn} onPress={enviar}><Text style={s.btnT}>Enviar</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
const s = StyleSheet.create({
  bubble:{ maxWidth:'80%', padding:12, borderRadius:tokens.radius.md, marginBottom:6 },
  me:{ alignSelf:'flex-end', backgroundColor:tokens.colors.primary },
  other:{ alignSelf:'flex-start', backgroundColor:'#E9ECEF' },
  inputRow:{ flexDirection:'row', padding:8, gap:8, borderTopWidth:1, borderColor:tokens.colors.border, backgroundColor:'#fff' },
  input:{ flex:1, borderWidth:1, borderColor:tokens.colors.border, borderRadius:tokens.radius.md, padding:12, minHeight:tokens.touch },
  btn:{ backgroundColor:tokens.colors.primary, paddingHorizontal:20, borderRadius:tokens.radius.md, justifyContent:'center', minHeight:tokens.touch },
  btnT:{ color:'#fff', fontWeight:'700' },
});
