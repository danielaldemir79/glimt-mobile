import { Text, View } from 'react-native';
import MemoryCard from './MemoryCard';

function MemoryList({ memories }) {
  if (memories.length === 0) {
    return (
      <Text>Inga minnen ännu.</Text>
    );
  }

  return (
    <View>
      {memories.map((memory) => (
        <MemoryCard
          key={memory.id}
          memory={memory}
        />
      ))}
    </View>
  );
}

export default MemoryList;