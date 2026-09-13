import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { tokens } from '@/lib/theme';
export default function Buscar() {
  const [fretes,setFretes]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const router=useRouter();
  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('fretes').select('*').eq('status','aberto').order('data_coleta').limit(50);
    setFretes(data ?? []); setLoading(false);
  })(); },[]);
  if (loading) return <View style={s.center}><ActivityIndicator color={tokens.colors.primary} /></View>;
  return (
    <FlatList contentContainerStyle={{ padding:16 }} data={fretes} keyExtractor={i=>i.id}
      ListEmptyComponent={<Text style={s.empty}>Nenhum frete disponível.</Text>}
      renderItem={({item})=>(
        <TouchableOpacity style={s.card} onPress={()=>router.push(`/frete/${item.id}`)}>
          <Text style={s.route}>{item.origem_cidade}/{item.origem_uf} → {item.destino_cidade}/{item.destino_uf}</Text>
          <Text style={s.sub}>{item.tipo_veiculo} • {item.carroceria} • {item.peso_kg}kg</Text>
          <Text style={s.price}>{item.valor_oferecido ? `R$ ${item.valor_oferecido}` : 'A combinar'}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
const s = StyleSheet.create({
  center:{ flex:1, alignItems:'center', justifyContent:'center' },
  card:{ backgroundColor:'#fff', padding:20, borderRadius:tokens.radius.lg, marginBottom:12, minHeight:tokens.touch },
  route:{ fontWeight:'700', fontSize:16, color:tokens.colors.text },
  sub:{ color:tokens.colors.muted, marginTop:4 },
  price:{ color:tokens.colors.primary, fontWeight:'700', fontSize:18, marginTop:8 },
  empty:{ textAlign:'center', color:tokens.colors.muted, marginTop:40 },
});
