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

export { API_BASE_URL, getMemories };