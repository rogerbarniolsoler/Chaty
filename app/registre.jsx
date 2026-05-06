import Pantalla from '@/components/Pantalla';
import { COLORS, MIDES } from '@/constants/tema';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Registre() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mostrarContrasenya, setMostrarContrasenya] = useState(false);
  const router = useRouter();

  const ferRegistre = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Atenció', 'Has d\'omplir tots els camps');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Atenció', 'Les contrasenyes no coincideixen');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      Alert.alert('Error de registre', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <Pantalla>
      <View style={estils.contenidor}>
        <Text style={estils.titol}>Crear un compte</Text>

        <TextInput
          style={estils.input}
          placeholder="Nom d'usuari"
          placeholderTextColor={COLORS.textClar}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={estils.input}
          placeholder="Correu electrònic"
          placeholderTextColor={COLORS.textClar}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={estils.inputContrasenya}>
          <TextInput
            style={estils.inputTextContrasenya}
            placeholder="Contrasenya"
            placeholderTextColor={COLORS.textClar}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!mostrarContrasenya}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setMostrarContrasenya(!mostrarContrasenya)}>
            <Ionicons 
              name={mostrarContrasenya ? 'eye-off' : 'eye'} 
              size={24} 
              color={COLORS.textClar} 
            />
          </TouchableOpacity>
        </View>

        <View style={estils.inputContrasenya}>
          <TextInput
            style={estils.inputTextContrasenya}
            placeholder="Repeteix la contrasenya"
            placeholderTextColor={COLORS.textClar}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!mostrarContrasenya}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={estils.botoPrincipal} onPress={ferRegistre}>
          <Text style={estils.textBotoPrincipal}>Registrar-se</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={estils.botoSecundari} 
          onPress={() => router.back()}
        >
          <Text style={estils.textBotoSecundari}>Ja tinc un compte</Text>
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
  inputContrasenya: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.missatgeAltre,
    borderRadius: 10,
    marginBottom: 15,
    paddingRight: 15,
  },
  inputTextContrasenya: {
    flex: 1,
    padding: 15,
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