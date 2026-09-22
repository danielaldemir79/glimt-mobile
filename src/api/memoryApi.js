import { File } from 'expo-file-system';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_URL = `${API_BASE_URL}/api/MemoryEntries`;

async function getMemories() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(API_URL, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error('Kunde inte hämta minnen.');
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function createMemory(memory) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memory),
  });

  if (!response.ok) {
    throw new Error('Kunde inte skapa minnet.');
  }

  return response.json();
}

async function uploadImage(image) {
  const imageFile = new File(image.uri);
  const formData = new FormData();

  formData.append('image', imageFile);

  const response = await fetch(`${API_BASE_URL}/api/Images`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || 'Kunde inte ladda upp bilden.');
  }

  return response.json();
}

export { API_BASE_URL, getMemories, createMemory, uploadImage };