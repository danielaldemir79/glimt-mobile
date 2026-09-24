import { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { API_BASE_URL } from '../api/memoryApi';

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
      <Modal
        animationType="slide"
        visible={isDetailsOpen}
        onRequestClose={() => setIsDetailsOpen(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.detailsContent}>
            {memory.imagePath && (
              <Image
                source={{
                  uri: `${API_BASE_URL}${memory.imagePath}`,
                }}
                style={styles.detailsImage}
                resizeMode="contain"
              />
            )}

            <Text style={styles.date}>{memory.date}</Text>
            <Text style={styles.detailsTitle}>{memory.title}</Text>
            <Text style={styles.detailsDescription}>
              {memory.description}
            </Text>
          </ScrollView>

          <Pressable
            style={styles.closeButton}
            onPress={() => setIsDetailsOpen(false)}
          >
            <Text style={styles.closeButtonText}>Stäng</Text>
          </Pressable>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#F7F8F5',
    padding: 24,
  },
  detailsContent: {
    paddingBottom: 24,
  },
  detailsImage: {
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
  detailsTitle: {
    color: '#1D2927',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 4,
  },
  detailsDescription: {
    color: '#33413E',
    fontSize: 17,
    lineHeight: 24,
    marginTop: 12,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#315C52',
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 48,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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