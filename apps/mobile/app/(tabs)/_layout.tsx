import { Tabs } from 'expo-router';
import { tokens } from '@/lib/theme';
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: tokens.colors.primary,
      tabBarStyle:{ height:72, paddingBottom:12, paddingTop:8 },
      headerStyle:{ backgroundColor: tokens.colors.primary },
      headerTintColor:'#fff',
    }}>
      <Tabs.Screen name="buscar" options={{ title:'Buscar' }} />
      <Tabs.Screen name="meus-fretes" options={{ title:'Meus Fretes' }} />
      <Tabs.Screen name="chat" options={{ title:'Chat' }} />
      <Tabs.Screen name="perfil" options={{ title:'Perfil' }} />
    </Tabs>
  );
}
