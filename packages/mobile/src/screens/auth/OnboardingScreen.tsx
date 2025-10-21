import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, RadioButton } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { apiClient } from "../../services/api";
import { useAuth } from "@clerk/clerk-expo";

type Props = NativeStackScreenProps<AuthStackParamList, "Onboarding">;

export function OnboardingScreen({ navigation }: Props) {
  const { getToken } = useAuth();
  const [role, setRole] = useState<"TRAINEE" | "TRAINER" | "GYM_OWNER">(
    "TRAINEE",
  );
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      apiClient.setAuthToken(token);

      await apiClient.completeOnboarding({ role });

      // Navigation will happen automatically via the root navigator
    } catch (err: any) {
      Alert.alert("Error", "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Clinch</Text>
        <Text style={styles.subtitle}>What brings you here?</Text>

        <View style={styles.optionsContainer}>
          <View style={styles.option}>
            <RadioButton.Android
              value="TRAINEE"
              status={role === "TRAINEE" ? "checked" : "unchecked"}
              onPress={() => setRole("TRAINEE")}
              color="#FF6B35"
            />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>I'm looking for training</Text>
              <Text style={styles.optionDescription}>
                Find and book sessions with experienced Muay Thai trainers
              </Text>
            </View>
          </View>

          <View style={styles.option}>
            <RadioButton.Android
              value="TRAINER"
              status={role === "TRAINER" ? "checked" : "unchecked"}
              onPress={() => setRole("TRAINER")}
              color="#FF6B35"
            />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>I'm a Trainer</Text>
              <Text style={styles.optionDescription}>
                Offer training services and manage your schedule
              </Text>
            </View>
          </View>

          <View style={styles.option}>
            <RadioButton.Android
              value="GYM_OWNER"
              status={role === "GYM_OWNER" ? "checked" : "unchecked"}
              onPress={() => setRole("GYM_OWNER")}
              color="#FF6B35"
            />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>I own a Gym</Text>
              <Text style={styles.optionDescription}>
                Manage your gym profile and connect with trainers
              </Text>
            </View>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleComplete}
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor="#FF6B35"
        >
          Continue
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  option: {
    flexDirection: "row",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#ccc",
  },
  button: {
    borderRadius: 8,
  },
});
