export const getCoverUrl = (name) => {
  const BASE_URL = 'https://misportadasstorage.blob.core.windows.net/portadas';
  if (!name) return `${BASE_URL}/dmc5dx.webp`;
  const lower = name.toLowerCase();
  if (lower.includes('hollow')) return `${BASE_URL}/HollowKnight.webp`;
  if (lower.includes('nier')) return `${BASE_URL}/NierAutomata.webp`;
  if (lower.includes('cyber')) return `${BASE_URL}/cyberpunk.jpg`;
  if (lower.includes('delta') || lower.includes('metal gear')) return `${BASE_URL}/mgsDelta.webp`;
  if (lower.includes('devil') || lower.includes('dmc')) return `${BASE_URL}/dmc5dx.webp`;
  return `${BASE_URL}/dmc5dx.webp`;
};
