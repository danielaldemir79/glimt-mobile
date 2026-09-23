import { useEffect, useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createMemory, updateMemory, uploadImage } from '../api/memoryApi';
import DateTimePicker from '@react-native-community/datetimepicker';

function MemoryForm({ onMemoryCreated, editingMemory }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!editingMemory) {
      return;
    }

    setTitle(editingMemory.title);
    setDate(editingMemory.date);
    setDescription(editingMemory.description);
    setSelectedImage(null);
  }, [editingMemory]);

  function handleDateChange(selectedDate) {
    setShowDatePicker(false);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');

    setDate(`${year}-${month}-${day}`);
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  }

  async function handleSubmit() {
    if (isSaving) {
      return;
    }

    if (!title || !date || !description) {
      setFormError('Fyll i alla fält.');
      return;
    }

    try {
      setIsSaving(true);
      setFormError('');

      let imagePath = editingMemory?.imagePath;

      if (selectedImage) {
        const uploadResult = await uploadImage(selectedImage);
        imagePath = uploadResult.imagePath;
      }

      const memoryData = {
        title,
        date,
        description,
        imagePath,
      };

      if (editingMemory) {
        const updatedMemory = await updateMemory(
          editingMemory.id,
          memoryData,
        );

        onMemoryCreated(updatedMemory);
      } else {
        const createdMemory = await createMemory(memoryData);
        onMemoryCreated(createdMemory);
      }

      setTitle('');
      setDate('');
      setDescription('');
      setSelectedImage(null);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.heading}>
        {editingMemory ? 'Redigera minne' : 'Nytt minne'}
      </Text>

      <Text>Titel</Text>
      <TextInput
        style={styles.input}
        value={title}
        maxLength={45}
        onChangeText={setTitle}
      />

      <Text style={styles.characterCount}>
        {title.length}/45 tecken
      </Text>

      <Text>Datum</Text>
      <Button
        title={date || 'Välj datum'}
        onPress={() => setShowDatePicker(true)}
        color="#315C52"
      />

      {showDatePicker && (
        <DateTimePicker
          value={date ? new Date(`${date}T00:00:00`) : new Date()}
          mode="date"
          maximumDate={new Date()}
          onValueChange={(_, selectedDate) => handleDateChange(selectedDate)}
          onDismiss={() => setShowDatePicker(false)}
        />
      )}

      <Text>Beskrivning</Text>
      <TextInput
        style={[styles.input, styles.description]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.imageSection}>
        <Button
          title="Välj bild"
          onPress={pickImage}
          color="#315C52"
        />

        {selectedImage && (
          <Text style={styles.selectedImage}>
            {selectedImage.fileName || 'Bild vald'}
          </Text>
        )}
      </View>

      {formError && (
        <Text style={styles.error}>{formError}</Text>
      )}

      <Button
        title={isSaving ? 'Sparar...' : 'Spara minne'}
        onPress={handleSubmit}
        disabled={isSaving}
        color="#315C52"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    marginBottom: 24,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderColor: '#AAB5B2',
    borderWidth: 1,
    marginBottom: 12,
    marginTop: 4,
    padding: 10,
  },
  description: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  error: {
    color: '#B42318',
    marginBottom: 12,
  },
  imageSection: {
    marginBottom: 12,
  },
  selectedImage: {
    marginBottom: 12,
    marginTop: 8,
  },
  characterCount: {
    color: '#596663',
    fontSize: 12,
    marginBottom: 12,
  },
});

export default MemoryForm;