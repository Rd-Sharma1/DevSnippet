import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const API_KEY_STORAGE = "gemini_api_key";

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load API key on mount
  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const stored = await SecureStore.getItemAsync(API_KEY_STORAGE);
      if (stored) {
        setApiKey(stored);
      } else {
        // Fallback to environment variable if no stored key
        setApiKey(process.env.EXPO_PUBLIC_GEMINI_API_KEY || null);
      }
    } catch (error) {
      console.log("Error loading API key:", error);
      setApiKey(process.env.EXPO_PUBLIC_GEMINI_API_KEY || null);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async (key: string) => {
    try {
      await SecureStore.setItemAsync(API_KEY_STORAGE, key);
      setApiKey(key);
      return true;
    } catch (error) {
      console.log("Error saving API key:", error);
      return false;
    }
  };

  const clearApiKey = async () => {
    try {
      await SecureStore.deleteItemAsync(API_KEY_STORAGE);
      setApiKey(process.env.EXPO_PUBLIC_GEMINI_API_KEY || null);
      return true;
    } catch (error) {
      console.log("Error clearing API key:", error);
      return false;
    }
  };

  return { apiKey, isLoading, saveApiKey, clearApiKey };
};
