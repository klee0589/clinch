import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Clinch</Text>
        <Text style={styles.subtitle}>Find Your Muay Thai Trainer</Text>
        <Text style={styles.description}>
          Connect with experienced Muay Thai trainers in your area. Book
          sessions, train online, and master the art of eight limbs.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("SignUp")}
          style={styles.button}
          buttonColor="#FF6B35"
        >
          Get Started
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("SignIn")}
          style={styles.button}
          textColor="#FF6B35"
        >
          Sign In
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "space-between",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FF6B35",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    borderRadius: 8,
  },
});
