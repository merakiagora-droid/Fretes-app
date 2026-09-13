import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { tokens } from '@/lib/theme';
export default function MeusFretes() {
  const [fretes,setFretes]=useState<any[]>([]);
  const router=useRouter();
  useEffect(()=>{ (async()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('fretes').select('*').eq('embarcador_id', user.id).order('created_at',{ ascending:false });
    setFretes(data ?? []);
  })(); },[]);
  return (
    <View style={{ flex:1 }}>
      <FlatList contentContainerStyle={{ padding:16 }} data={fretes} keyExtractor={i=>i.id}
        ListEmptyComponent={<Text style={s.empty}>Você ainda não publicou fretes.</Text>}
        renderItem={({item})=>(
          <TouchableOpacity style={s.card} onPress={()=>router.push(`/frete/${item.id}`)}>
            <Text style={s.route}>{item.origem_cidade}/{item.origem_uf} → {item.destino_cidade}/{item.destino_uf}</Text>
            <Text style={s.sub}>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={s.fab} onPress={()=>router.push('/publicar')}><Text style={s.fabT}>+</Text></TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  card:{ backgroundColor:'#fff', padding:20, borderRadius:tokens.radius.lg, marginBottom:12, minHeight:tokens.touch },
  route:{ fontWeight:'700', fontSize:16 },
  sub:{ color:tokens.colors.muted, marginTop:4 },
  empty:{ textAlign:'center', color:tokens.colors.muted, marginTop:40 },
  fab:{ position:'absolute', right:20, bottom:20, backgroundColor:tokens.colors.primary, width:64, height:64, borderRadius:32, alignItems:'center', justifyContent:'center' },
  fabT:{ color:'#fff', fontSize:32, lineHeight:34 },
});
