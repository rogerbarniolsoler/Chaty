import Pantalla from '@/components/Pantalla';
import { COLORS, MIDES } from '@/constants/tema';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const ferLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenció', 'Has d\'introduir correu i contrasenya');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error d\'inici de sessió', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <Pantalla>
      <View style={estils.contenidor}>
        <Text style={estils.titol}>Iniciar sessió</Text>

        <TextInput
          style={estils.input}
          placeholder="Correu electrònic"
          placeholderTextColor={COLORS.textClar}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={estils.input}
          placeholder="Contrasenya"
          placeholderTextColor={COLORS.textClar}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
        />

        <TouchableOpacity style={estils.botoPrincipal} onPress={ferLogin}>
          <Text style={estils.textBotoPrincipal}>Iniciar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={estils.botoSecundari} 
          onPress={() => router.push('/registre')}
        >
          <Text style={estils.textBotoSecundari}>Registrar-se</Text>
        </TouchableOpacity>
      </View>
    </Pantalla>
  );
}

const estils = StyleSheet.create({
  contenidor: {
    flex: 1,
    justifyContent: 'top',
    paddingTop: 150,
  },
  titol: {
    fontSize: MIDES.titol,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.missatgeAltre,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: MIDES.mitjana,
    color: COLORS.text,
  },
  botoPrincipal: {
    backgroundColor: COLORS.missatgeMeu,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textBotoPrincipal: {
    color: COLORS.textMissatgeMeu,
    fontSize: MIDES.mitjana,
    fontWeight: 'bold',
  },
  botoSecundari: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  textBotoSecundari: {
    color: COLORS.textClar,
    fontSize: MIDES.mitjana,
  },
});