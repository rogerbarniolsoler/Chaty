import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Amaguem la capçalera principal perquè els tabs ja en tindran la seva */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}