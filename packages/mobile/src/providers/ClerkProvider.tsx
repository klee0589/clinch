import {
  ClerkProvider as BaseClerkProvider,
  ClerkLoaded,
} from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { config } from "../../config";

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseClerkProvider
      publishableKey={config.clerk.publishableKey}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>{children}</ClerkLoaded>
    </BaseClerkProvider>
  );
}
