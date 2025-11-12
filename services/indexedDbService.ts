import { TrainerData, Pokemon } from '../types';

const DB_NAME = 'pokemon_db';
const STORE_NAME = 'trainer_data';
const DB_VERSION = 1;

interface IndexedDbTrainerData {
  trainerId: string;
  tokens: number;
  collectedPokemon: Pokemon[];
}

/**
 * Initializes the IndexedDB.
 * @returns A Promise that resolves with the database instance.
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'trainerId' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
      reject('IndexedDB error');
    };
  });
}

/**
 * Retrieves trainer data from IndexedDB.
 * @param trainerId The ID of the trainer to retrieve.
 * @returns A Promise that resolves with the TrainerData or null if not found.
 */
export async function getTrainerData(trainerId: string): Promise<TrainerData | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(trainerId);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = (event) => {
      console.error('Error getting trainer data:', (event.target as IDBRequest).error);
      reject('Error getting trainer data');
    };
  });
}

/**
 * Saves trainer data to IndexedDB.
 * @param trainerData The TrainerData object to save.
 * @returns A Promise that resolves when the data is saved.
 */
export async function saveTrainerData(trainerData: TrainerData): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(trainerData);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      console.error('Error saving trainer data:', (event.target as IDBRequest).error);
      reject('Error saving trainer data');
    };
  });
}