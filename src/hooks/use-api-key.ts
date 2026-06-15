import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const API_KEY_STORAGE = "gemini_api_key";

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const stored = await SecureStore.getItemAsync(API_KEY_STORAGE);
      setApiKey(stored || null);
    } catch (_) {
      setApiKey(null);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async (key: string) => {
    try {
      await SecureStore.setItemAsync(API_KEY_STORAGE, key);
      setApiKey(key);
      return true;
    } catch (_) {
      return false;
    }
  };

  const clearApiKey = async () => {
    try {
      await SecureStore.deleteItemAsync(API_KEY_STORAGE);
      setApiKey(null);
      return true;
    } catch (_) {
      return false;
    }
  };

  return { apiKey, isLoading, saveApiKey, clearApiKey };
};
