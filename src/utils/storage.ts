import { AppData } from '../types';
import { INITIAL_APP_DATA } from '../data/initialData';

const STORAGE_KEY = 'app_data_v1';
const API_KEY_STORAGE_KEY = 'gemini_api_key';

export function loadAppData(): AppData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      saveAppData(INITIAL_APP_DATA);
      return INITIAL_APP_DATA;
    }
    const parsed = JSON.parse(saved);
    // Ensure nested objects exist
    return {
      subjects: parsed.subjects || INITIAL_APP_DATA.subjects,
      questions: parsed.questions || INITIAL_APP_DATA.questions,
      sessions: parsed.sessions || INITIAL_APP_DATA.sessions,
      progress: parsed.progress || INITIAL_APP_DATA.progress,
      settings: parsed.settings || INITIAL_APP_DATA.settings,
    };
  } catch (error) {
    console.error('Failed to load app data from localStorage:', error);
    return INITIAL_APP_DATA;
  }
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save app data to localStorage:', error);
  }
}

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string): void {
  try {
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to save API key:', error);
  }
}

export function exportDataAsJson(data: AppData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-app-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importDataFromJson(jsonString: string): AppData | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.subjects) && Array.isArray(parsed.questions)) {
      saveAppData(parsed);
      return parsed as AppData;
    }
    return null;
  } catch (error) {
    console.error('Invalid JSON import:', error);
    return null;
  }
}

export function resetToDefaultData(): AppData {
  saveAppData(INITIAL_APP_DATA);
  return INITIAL_APP_DATA;
}
