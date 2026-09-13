import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { supabase } from '@/lib/supabase';
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert:true, shouldPlaySound:true, shouldSetBadge:false }),
});
export default function Root() {
  useEffect(()=>{ (async()=>{
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    const { data: { user } } = await supabase.auth.getUser();
    if (user && token) await supabase.from('push_tokens').upsert({ user_id:user.id, token, plataforma:'android' });
  })(); },[]);
  return (<><StatusBar style="auto" /><Stack screenOptions={{ headerShown:false }} /></>);
}
