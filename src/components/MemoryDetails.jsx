import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { API_BASE_URL } from '../api/memoryApi';

function MemoryDetails({ memory, visible, onClose }) {
  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
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

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Stäng</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  date: {
    color: '#596663',
    fontSize: 14,
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
});

export default MemoryDetails;







