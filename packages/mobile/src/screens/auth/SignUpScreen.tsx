import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSignUp } from "@clerk/clerk-expo";
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export function SignUpScreen({ navigation }: Props) {
  const { signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!signUp) return;

    try {
      setLoading(true);

      // Create the sign-up attempt
      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      // Check if email verification is required
      if (result.status === "missing_requirements") {
        // Email verification required - prepare the verification
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        // Navigate to verification screen
        navigation.navigate("VerifyEmail");
      } else if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigation.navigate("Onboarding");
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Clinch today</Text>

        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          mode="outlined"
          outlineColor="#444"
          activeOutlineColor="#FF6B35"
          textColor="#fff"
        />

        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          mode="outlined"
          outlineColor="#444"
          activeOutlineColor="#FF6B35"
          textColor="#fff"
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
          outlineColor="#444"
          activeOutlineColor="#FF6B35"
          textColor="#fff"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          outlineColor="#444"
          activeOutlineColor="#FF6B35"
          textColor="#fff"
        />

        <Button
          mode="contained"
          onPress={handleSignUp}
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor="#FF6B35"
        >
          Sign Up
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate("SignIn")}
          textColor="#FF6B35"
          style={styles.linkButton}
        >
          Already have an account? Sign In
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
  input: {
    marginBottom: 16,
    backgroundColor: "#2a2a2a",
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  linkButton: {
    marginTop: 16,
  },
});
