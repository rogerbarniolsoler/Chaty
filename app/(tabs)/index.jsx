import Pantalla from '@/components/Pantalla';
import { COLORS, MIDES } from '@/constants/tema';
import { supabase } from '@/lib/supabase';
import { useUsuariStore } from '@/store/usuari';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const sessio = useUsuariStore((state) => state.sessio);
  const tancarSessioStore = useUsuariStore((state) => state.tancarSessio);
  
  const [xats, setXats] = useState([]);
  const router = useRouter();

  // Obtenim les dades directament del store de Zustand
  const meuId = sessio?.user?.id;
  const nom = sessio?.user?.user_metadata?.username ?? 'Usuari';

  useEffect(() => {
    if (!meuId) return;

    carregarXats();

    const canal = supabase
      .channel('public:missatges')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'missatges' },
        (payload) => {
          const nouMissatge = payload.new;
          if (nouMissatge.usuari_enviat === meuId || nouMissatge.usuari_rebre === meuId) {
            carregarXats(); 
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [meuId]);

  const carregarXats = async () => {
    const { data: missatges, error } = await supabase
      .from('missatges')
      .select('*')
      .or(`usuari_enviat.eq.${meuId},usuari_rebre.eq.${meuId}`)
      .order('created_at', { ascending: false });

    if (error || !missatges) return;

    const idsAltres = [...new Set(missatges.map(m => 
      m.usuari_enviat === meuId ? m.usuari_rebre : m.usuari_enviat
    ))];

    const { data: usuaris } = await supabase
      .from('usuaris_noms')
      .select('id, username')
      .in('id', idsAltres);

    const mapaNoms = {};
    if (usuaris) {
      usuaris.forEach(u => mapaNoms[u.id] = u.username);
    }

    const converses = {};
    missatges.forEach((m) => {
      const idAltre = m.usuari_enviat === meuId ? m.usuari_rebre : m.usuari_enviat;
      
      if (!converses[idAltre]) {
        converses[idAltre] = {
          id: idAltre,
          nomAltre: mapaNoms[idAltre] || 'Usuari Desconegut',
          ultimMissatge: m.missatge,
          hora: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
    });

    setXats(Object.values(converses));
  };

  const tancarSessio = async () => {
    await tancarSessioStore();
    // No cal router.replace('/login') aquí, el _layout.jsx ho farà automàticament en detectar que state.sessio és null!
  };

  const renderXat = ({ item }) => (
    <TouchableOpacity 
      style={estils.targetaXat}
      onPress={() => router.push({ pathname: '/xat', params: { id: item.id, nom: item.nomAltre } })}
    >
      <View style={estils.avatarPla}>
        <Ionicons name="person" size={24} color={COLORS.textClar} />
      </View>
      <View style={estils.infoXat}>
        <View style={estils.filaSuperior}>
          <Text style={estils.nomXat}>{item.nomAltre}</Text>
          <Text style={estils.horaXat}>{item.hora}</Text>
        </View>
        <Text style={estils.missatgeXat} numberOfLines={1}>
          {item.ultimMissatge}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Pantalla>
      <View style={estils.header}>
        <Text style={estils.salutacio}>Hola, {nom}</Text>
        <TouchableOpacity onPress={tancarSessio}>
          <Ionicons name="log-out-outline" size={24} color={"red"} />
        </TouchableOpacity>
      </View>

      {xats.length === 0 ? (
        <View style={estils.contingutBuit}>
          <Text style={estils.textBuit}>Encara no tens cap xat...</Text>
        </View>
      ) : (
        <FlatList
          data={xats}
          keyExtractor={(item) => item.id}
          renderItem={renderXat}
          contentContainerStyle={estils.llista}
        />
      )}
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

  contingutBuit: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textBuit: {
    color: COLORS.textClar,
    fontSize: MIDES.mitjana,
  },

  llista: {
    paddingBottom: 20,
  },

  targetaXat: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.missatgeAltre,
  },

  avatarPla: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.missatgeAltre,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  infoXat: {
    flex: 1,
    justifyContent: 'center',
  },

  filaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  nomXat: {
    fontSize: MIDES.mitjana,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  horaXat: {
    fontSize: MIDES.petita,
    color: COLORS.textClar,
  },

  missatgeXat: {
    fontSize: MIDES.mitjana,
    color: COLORS.textClar,
  },

  // Intros / components reutilitzables

  pantalla: {
    flex: 1,
    backgroundColor: COLORS.fons,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  botoIcona: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.missatgeAltre,
  },

  avatarText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: MIDES.mitjana,
  },

  separador: {
    height: 1,
    backgroundColor: COLORS.missatgeAltre,
  },

  contadorNoLlegit: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primari,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  textContador: {
    color: COLORS.blanc,
    fontSize: MIDES.petita,
    fontWeight: 'bold',
  },

  estatOnline: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: COLORS.fons,
  },
});