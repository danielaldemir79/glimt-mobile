import { useEffect, useRef, useState } from 'react';
import { deleteMemory, getMemories } from './src/api/memoryApi';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MemoryList from './src/components/MemoryList';
import MemoryForm from './src/components/MemoryForm';

export default function App() {
  const [memories, setMemories] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const scrollViewRef = useRef(null);

  function handleMemorySaved(savedMemory) {
    setMemories((currentMemories) => {
      if (editingMemory) {
        return currentMemories
          .map((memory) =>
            memory.id === savedMemory.id ? savedMemory : memory,
          )
          .sort((firstMemory, secondMemory) =>
            secondMemory.date.localeCompare(firstMemory.date),
          );
      }

      return [savedMemory, ...currentMemories].sort(
        (firstMemory, secondMemory) =>
          secondMemory.date.localeCompare(firstMemory.date),
      );
    });

    setEditingMemory(null);
    setIsFormOpen(false);
  }

  async function handleMemoryDeleted(memoryId) {
    await deleteMemory(memoryId);

    setMemories((currentMemories) =>
      currentMemories.filter((memory) => memory.id !== memoryId),
    );

    if (editingMemory?.id === memoryId) {
      setEditingMemory(null);
      setIsFormOpen(false);
    }
  }

  function startEditing(memory) {
    setEditingMemory(memory);
    setIsFormOpen(true);

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    });
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
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <Pressable
            style={styles.newMemoryButton}
            onPress={() => {
              if (isFormOpen) {
                setEditingMemory(null);
              }

              setIsFormOpen((currentValue) => !currentValue);
            }}
          >
            <Text style={styles.newMemoryButtonText}>
              {isFormOpen ? 'Stäng formulär' : 'Nytt minne'}
            </Text>
          </Pressable>

          {isFormOpen && (
            <MemoryForm
              onMemoryCreated={handleMemorySaved}
              editingMemory={editingMemory}
            />
          )}
          <Text style={styles.sectionTitle}>Senaste minnen</Text>

          {isLoading ? (
            <Text>Hämtar minnen...</Text>
          ) : loadError ? (
            <Text>{loadError}</Text>
          ) : (
            <MemoryList memories={memories} onEdit={startEditing} onDelete={handleMemoryDeleted} />
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
  newMemoryButton: {
    alignItems: 'center',
    backgroundColor: '#315C52',
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 52,
    paddingHorizontal: 20,
  },
  newMemoryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#1D2927',
    fontSize: 24,
    fontWeight: '700',
  },
  contentContainer: {
    alignSelf: 'center',
    maxWidth: 600,
    padding: 24,
    paddingBottom: 40,
    width: '100%',
  },
});