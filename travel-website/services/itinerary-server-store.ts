import { promises as fs } from 'fs';
import path from 'path';

export interface SavedItineraryRecord {
  id: string;
  userId: string; // Phân tách theo người dùng (Guest Cookie hoặc User Account)
  tripName: string;
  waypoints: Array<{ name: string; lat: number; lng: number }>;
  vehicle: string;
  distanceKm: number;
  durationMin: number;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'saved-itineraries.json');

/**
 * Đảm bảo thư mục data và file JSON lưu trữ tồn tại bền vững trên đĩa cứng
 */
async function ensureDataFileExists(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * Đọc danh sách lịch trình từ file lưu trữ bền vững.
 * Nếu truyền userId thì lọc riêng cho người dùng đó (Per-user Isolation).
 */
export async function getSavedItineraries(userId?: string): Promise<SavedItineraryRecord[]> {
  await ensureDataFileExists();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const allRecords: SavedItineraryRecord[] = JSON.parse(raw);
    if (!Array.isArray(allRecords)) return [];
    if (!userId) return allRecords;
    return allRecords.filter((rec) => rec.userId === userId);
  } catch (error) {
    console.error('[Server Store] Lỗi khi đọc file lưu trữ:', error);
    return [];
  }
}

/**
 * Ghi nhận bản ghi lịch trình mới xuống đĩa cứng bền vững (Persistence qua restart)
 */
export async function saveItineraryRecord(record: SavedItineraryRecord): Promise<void> {
  await ensureDataFileExists();
  try {
    const currentList = await getSavedItineraries();
    // Chèn bản ghi mới nhất lên đầu danh sách
    const updatedList = [record, ...currentList.filter((r) => r.id !== record.id)];
    await fs.writeFile(DATA_FILE, JSON.stringify(updatedList, null, 2), 'utf-8');
  } catch (error) {
    console.error('[Server Store] Lỗi khi ghi file lưu trữ:', error);
    throw error;
  }
}
