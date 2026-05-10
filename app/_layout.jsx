import { supabase } from '@/lib/supabase';
import { useUsuariStore } from '@/store/usuari';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const sessio = useUsuariStore((state) => state.sessio);
  const carregant = useUsuariStore((state) => state.carregant);
  const setSessio = useUsuariStore((state) => state.setSessio);
  const inicialitzar = useUsuariStore((state) => state.inicialitzar);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    inicialitzar();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSessio(session)
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (carregant) return;

    const dinsGrupTabs = segments[0] === '(tabs)';

    if (!sessio && dinsGrupTabs) {
      router.replace('/login');
    } else if (sessio && !dinsGrupTabs) {
      router.replace('/(tabs)');
    }
  }, [sessio, segments, carregant]);

  if (carregant) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="registre" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}