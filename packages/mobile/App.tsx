import { StatusBar } from "expo-status-bar";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import { ClerkProvider } from "./src/providers/ClerkProvider";
import { RootNavigator } from "./src/navigation/RootNavigator";

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#FF6B35",
    background: "#1a1a1a",
    surface: "#2a2a2a",
    error: "#F44336",
  },
};

export default function App() {
  return (
    <ClerkProvider>
      <PaperProvider theme={theme}>
        <RootNavigator />
        <StatusBar style="light" />
      </PaperProvider>
    </ClerkProvider>
  );
}
