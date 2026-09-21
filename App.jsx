import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MemoryList from './src/components/MemoryList';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.title}>Glimt</Text>
          <Text style={styles.subtitle}>Din fotodagbok</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Senaste minnen</Text>
          <MemoryList />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#183A37',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: '#DCE8E5',
    fontSize: 16,
    marginTop: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#F7F8F5',
    padding: 24,
  },
  sectionTitle: {
    color: '#1D2927',
    fontSize: 24,
    fontWeight: '700',
  },
});