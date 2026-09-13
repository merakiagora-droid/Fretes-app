import { useEffect, useState } from 'react';
import { Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { tokens } from '@/lib/theme';
export default function ChatList() {
  const [items,setItems]=useState<any[]>([]);
  const router=useRouter();
  useEffect(()=>{ (async()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('conversas')
      .select('*, fretes(origem_cidade,origem_uf,destino_cidade,destino_uf)')
      .or(`embarcador_id.eq.${user.id},motorista_id.eq.${user.id}`);
    setItems(data ?? []);
  })(); },[]);
  return (
    <FlatList contentContainerStyle={{ padding:16 }} data={items} keyExtractor={i=>i.id}
      ListEmptyComponent={<Text style={s.empty}>Nenhuma conversa.</Text>}
      renderItem={({item})=>(
        <TouchableOpacity style={s.card} onPress={()=>router.push(`/chat/${item.id}`)}>
          <Text style={s.route}>{item.fretes?.origem_cidade}/{item.fretes?.origem_uf} → {item.fretes?.destino_cidade}/{item.fretes?.destino_uf}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
const s = StyleSheet.create({
  card:{ backgroundColor:'#fff', padding:20, borderRadius:tokens.radius.lg, marginBottom:12, minHeight:tokens.touch },
  route:{ fontWeight:'700' },
  empty:{ textAlign:'center', color:tokens.colors.muted, marginTop:40 },
});
