import { useEffect, useState } from 'react';
import { getMemories } from './src/api/memoryApi';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MemoryList from './src/components/MemoryList';

export default function App() {
  const [memories, setMemories] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMemories() {
      try {
        setLoadError('');

        const apiMemories = await getMemories();
        setMemories(apiMemories);
      } catch {
        setLoadError('Kunde inte hämta dina minnen.');
      } finally {
        setIsLoading(false);
      }
    }

    loadMemories();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.title}>Glimt</Text>
          <Text style={styles.subtitle}>Din fotodagbok</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.sectionTitle}>Senaste minnen</Text>
          
          {isLoading ? (
            <Text>Hämtar minnen...</Text>
          ) : loadError ? (
            <Text>{loadError}</Text>
          ) : (
            <MemoryList memories={memories} />
          )}
          
        </ScrollView>
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
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#1D2927',
    fontSize: 24,
    fontWeight: '700',
  },
});