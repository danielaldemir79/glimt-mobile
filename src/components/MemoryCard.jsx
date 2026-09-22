import { Image, StyleSheet, Text, View } from 'react-native';
import { API_BASE_URL } from '../api/memoryApi';

function MemoryCard({ memory }) {
  return (
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
      <Text style={styles.title}>{memory.title}</Text>
      <Text style={styles.description}>{memory.description}</Text>
    </View>
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
});

export default MemoryCard;