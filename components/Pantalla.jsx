import { COLORS } from '@/constants/tema';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Pantalla({ children }) {
  return (
    <SafeAreaView style={estils.contenidor}>
      {children}
    </SafeAreaView>
  );
}

const estils = StyleSheet.create({
  contenidor: {
    flex: 1,
    backgroundColor: COLORS.fons,
    paddingHorizontal: 16,
  },
});