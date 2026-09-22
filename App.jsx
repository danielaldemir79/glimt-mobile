import { useEffect, useState } from 'react';
import { getMemories } from './src/api/memoryApi';
import { StatusBar } from 'expo-status-bar';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MemoryList from './src/components/MemoryList';
import MemoryForm from './src/components/MemoryForm';

export default function App() {
  const [memories, setMemories] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  function addMemory(createdMemory) {
  setMemories((currentMemories) =>
    [createdMemory, ...currentMemories].sort(
      (firstMemory, secondMemory) =>
        secondMemory.date.localeCompare(firstMemory.date),
    ),
  );
  setIsFormOpen(false);
}

  useEffect(() => {
    async function loadMemories() {
      try {
        setLoadError('');

        const apiMemories = await getMemories();
        setMemories(
          [...apiMemories].sort(
            (firstMemory, secondMemory) =>
              secondMemory.date.localeCompare(firstMemory.date),
          ),
        );
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
          <Button
            title={isFormOpen ? 'Stäng formulär' : 'Nytt minne'}
            onPress={() => setIsFormOpen((currentValue) => !currentValue)}
            color="#315C52"
          />

          {isFormOpen && (
            <MemoryForm onMemoryCreated={addMemory} />
          )}
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