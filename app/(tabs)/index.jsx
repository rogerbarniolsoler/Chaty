import Pantalla from '@/components/Pantalla';
import { COLORS, MIDES } from '@/constants/tema';
import { Text } from 'react-native';

export default function HomeScreen() {
  return (
    <Pantalla>
      <Text style={{ fontSize: MIDES.titol, color: COLORS.text }}>Hola Xat!</Text>
    </Pantalla>
  );
}