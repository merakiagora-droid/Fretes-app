import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { tokens } from '@/lib/theme';
export default function ZenDriveOverlay() {
  const [vel,setVel]=useState(0);
  useEffect(()=>{
    let sub: Location.LocationSubscription | null = null;
    (async()=>{
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 3000 }, loc=>{
        setVel((loc.coords.speed ?? 0) * 3.6);
      });
    })();
    return ()=>{ sub?.remove(); };
  },[]);
  if (vel <= 15) return null;
  return (
    <View style={s.overlay} pointerEvents="none">
      <Text style={s.txt}>Modo Zen Drive ativo • {vel.toFixed(0)} km/h</Text>
      <Text style={s.sub}>Interface simplificada por segurança</Text>
    </View>
  );
}
const s = StyleSheet.create({
  overlay:{ position:'absolute', top:0, left:0, right:0, backgroundColor:'rgba(10,36,99,0.95)', padding:16, zIndex:100 },
  txt:{ color:'#fff', fontWeight:'700', fontSize:16 },
  sub:{ color:'#00E676', fontSize:13, marginTop:2 },
});
