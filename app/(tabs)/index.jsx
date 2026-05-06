import Pantalla from '@/components/Pantalla';
import { COLORS, MIDES } from '@/constants/tema';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [nom, setNom] = useState('');
  const router = useRouter();

  useEffect(() => {
    recuperarUsuari();
  }, []);

  const recuperarUsuari = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setNom(session.user.user_metadata.username || 'Usuari');
    }
  };

  const tancarSessio = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <Pantalla>
      <View style={estils.header}>
        <Text style={estils.salutacio}>Hola, {nom}</Text>
        <TouchableOpacity onPress={tancarSessio}>
          <Ionicons name="log-out-outline" size={24} color={"red"} />
        </TouchableOpacity>
      </View>

      <View style={estils.contingut}>
        <Text style={estils.textBuit}>Aquí apareixeran els teus xats aviat...</Text>
      </View>
    </Pantalla>
  );
}

const estils = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  salutacio: {
    fontSize: MIDES.titol,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  contingut: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBuit: {
    color: COLORS.textClar,
    fontSize: MIDES.mitjana,
  },
});