import { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { API_BASE_URL } from '../api/memoryApi';
import MemoryDetails from './MemoryDetails';

function MemoryCard({ memory, onEdit, onDelete }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  function handleDeletePress() {
    Alert.alert(
      'Ta bort minnet?',
      'Det här minnet kommer att tas bort permanent.',
      [
        {
          text: 'Avbryt',
          style: 'cancel',
        },
        {
          text: 'Ta bort',
          style: 'destructive',
          onPress: async () => {
            try {
              await onDelete(memory.id);
              setIsDetailsOpen(false);
            } catch {
              Alert.alert('Kunde inte ta bort minnet.');
            }
          },
        },
      ],
    );
  }

  return (
    <>
      <View style={styles.card}>
        {memory.imagePath && (
          <Image
            source={{
              uri: `${API_BASE_URL}${memory.imagePath}`,
            }}
            style={styles.image}
          />
        )}

        <Text style={styles.date}>{memory.date}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {memory.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {memory.description}
        </Text>
        <Button
          title="Visa hela minnet"
          onPress={() => setIsDetailsOpen(true)}
          color="#315C52"
        />
        <View style={styles.buttonRow}>
          <View style={styles.buttonColumn}>
            <Button
              title="Redigera"
              onPress={() => onEdit(memory)}
              color="#315C52"
            />
          </View>
          <View style={styles.buttonColumn}>
            <Button
              title="Ta bort"
              onPress={handleDeletePress}
              color="#9B2C2C"
            />
          </View>
        </View>
      </View>

      <MemoryDetails
        memory={memory}
        visible={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    marginTop: 16,
    padding: 16,
  },
  date: {
    color: '#596663',
    fontSize: 14,
  },
  title: {
    color: '#1D2927',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  description: {
    color: '#33413E',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 4,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  buttonColumn: {
    flex: 1,
  },
});

export default MemoryCard;