import Pantalla from '@/components/Pantalla';
import { COLORS, MIDES } from '@/constants/tema';
import { supabase } from '@/lib/supabase';
import { useUsuariStore } from '@/store/usuari';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PantallaXat() {
  const { id: idAltre, nom: nomAltre } = useLocalSearchParams();

  const sessio = useUsuariStore((state) => state.sessio);

  const meuId = sessio?.user?.id;
  const elMeuNom = sessio?.user?.user_metadata?.username;

  const [missatges, setMissatges] = useState([]);
  const [nouMissatge, setNouMissatge] = useState('');
  const [altreEscrivint, setAltreEscrivint] = useState(false);

  const flatListRef = useRef(null);
  const timeoutEscrivint = useRef(null);

  const router = useRouter();

  useEffect(() => {
    carregarHistorial();

    const canal = supabase.channel(
      `xat-${[meuId, idAltre].sort().join('-')}`
    );

    // Missatges realtime
    canal.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'missatges',
      },
      (payload) => {
        const m = payload.new;

        if (
          (m.usuari_enviat === meuId &&
            m.usuari_rebre === idAltre) ||
          (m.usuari_enviat === idAltre &&
            m.usuari_rebre === meuId)
        ) {
          setMissatges((prev) => [...prev, m]);
        }
      }
    );

    // Escrivint realtime
    canal.on(
      'broadcast',
      { event: 'escrivint' },
      ({ payload }) => {
        if (payload.userId !== meuId) {
          setAltreEscrivint(payload.escrivint);

          // Reinicia timeout
          if (timeoutEscrivint.current) {
            clearTimeout(timeoutEscrivint.current);
          }

          timeoutEscrivint.current = setTimeout(() => {
            setAltreEscrivint(false);
          }, 2000);
        }
      }
    );

    canal.subscribe();

    return () => {
      supabase.removeChannel(canal);

      if (timeoutEscrivint.current) {
        clearTimeout(timeoutEscrivint.current);
      }
    };
  }, []);

  const carregarHistorial = async () => {
    const { data, error } = await supabase
      .from('missatges')
      .select('*')
      .or(
        `and(usuari_enviat.eq.${meuId},usuari_rebre.eq.${idAltre}),and(usuari_enviat.eq.${idAltre},usuari_rebre.eq.${meuId})`
      )
      .order('created_at', { ascending: true });

    if (!error) setMissatges(data);
  };

  const enviarMissatge = async () => {
    if (!nouMissatge.trim()) return;

    const textEnviar = nouMissatge.trim();

    setNouMissatge('');

    const { error } = await supabase
      .from('missatges')
      .insert({
        missatge: textEnviar,
        usuari_enviat: meuId,
        usuari_rebre: idAltre,
      });

    if (error) {
      console.error('Error enviant:', error.message);
    }

    // Deixar de mostrar "escrivint"
    enviarEstatEscrivint(false);
  };

  const enviarEstatEscrivint = async (estat) => {
    const canal = supabase.channel(
      `xat-${[meuId, idAltre].sort().join('-')}`
    );

    await canal.subscribe();

    canal.send({
      type: 'broadcast',
      event: 'escrivint',
      payload: {
        userId: meuId,
        escrivint: estat,
      },
    });
  };

  const gestionarText = (text) => {
    setNouMissatge(text);

    enviarEstatEscrivint(text.trim().length > 0);
  };

  const renderItem = ({ item }) => {
    const esMeu = item.usuari_enviat === meuId;

    return (
      <View
        style={[
          estils.contenidorMissatge,
          esMeu
            ? estils.meuAliniat
            : estils.altreAliniat,
        ]}
      >
        {!esMeu && (
          <View style={estils.avatarPetit}>
            <Ionicons
              name="person"
              size={14}
              color={COLORS.textClar}
            />
          </View>
        )}

        <View
          style={[
            estils.globus,
            esMeu
              ? estils.globusMeu
              : estils.globusAltre,
          ]}
        >
          <Text
            style={[
              estils.nomUsuari,
              {
                color: esMeu
                  ? COLORS.textMissatgeMeu
                  : COLORS.textClar,
              },
            ]}
          >
            {esMeu ? elMeuNom : nomAltre}
          </Text>

          <Text
            style={{
              color: esMeu
                ? COLORS.textMissatgeMeu
                : COLORS.textMissatgeAltre,
              fontSize: MIDES.mitjana,
            }}
          >
            {item.missatge}
          </Text>

          <Text style={estils.hora}>
            {new Date(item.created_at).toLocaleTimeString(
              [],
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            )}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Pantalla>
      <View style={estils.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={estils.titolNom} numberOfLines={1}>
          {nomAltre}
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
      >
        <FlatList
          ref={flatListRef}
          data={missatges}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 20 }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {altreEscrivint && (
          <View style={estils.contenidorEscrivint}>
            <Text style={estils.textEscrivint}>Escrivint...</Text>
          </View>
        )}

        <View style={estils.areaInput}>
          <TextInput
            style={estils.input}
            value={nouMissatge}
            onChangeText={gestionarText}
            placeholder="Escriu un missatge..."
            placeholderTextColor={COLORS.textClar}
            multiline
          />

          <TouchableOpacity style={estils.botoEnviar} onPress={enviarMissatge}>
            <Ionicons name="send" size={20} color={COLORS.textMissatgeMeu} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Pantalla>
  );
}

const estils = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.missatgeAltre,
  },

  titolNom: {
    fontSize: MIDES.gran,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },

  contenidorMissatge: {
    flexDirection: 'row',
    marginBottom: 10,
    maxWidth: '85%',
    alignItems: 'flex-end',
  },

  meuAliniat: {
    alignSelf: 'flex-end',
  },

  altreAliniat: {
    alignSelf: 'flex-start',
  },

  avatarPetit: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.missatgeAltre,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginBottom: 5,
  },

  globus: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  globusMeu: {
    backgroundColor: COLORS.missatgeMeu,
    borderBottomRightRadius: 5,
  },

  globusAltre: {
    backgroundColor: COLORS.missatgeAltre,
    borderBottomLeftRadius: 5,
  },

  nomUsuari: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  hora: {
    fontSize: 9,
    color: COLORS.text,
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  contenidorEscrivint: {
    paddingHorizontal: 0,
    paddingBottom: 5,
    alignSelf: 'flex-start',
  },
  
  textEscrivint: {
    fontSize: MIDES.petita,
    color: COLORS.missatgeMeu,
  },

  areaInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.missatgeAltre,
  },

  input: {
    flex: 1,
    backgroundColor: COLORS.missatgeAltre,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: MIDES.mitjana,
    color: COLORS.text,
    maxHeight: 100,
  },

  botoEnviar: {
    backgroundColor: COLORS.missatgeMeu,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});