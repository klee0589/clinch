import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSignUp } from "@clerk/clerk-expo";
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "VerifyEmail">;

export function VerifyEmailScreen({ navigation, route }: Props) {
  const { signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!signUp || !code) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    try {
      setLoading(true);

      // Attempt to verify the email with the code
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigation.navigate("Onboarding");
      } else {
        Alert.alert(
          "Error",
          "Verification incomplete. Status: " + result.status,
        );
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      const errorMessage =
        err.errors?.[0]?.longMessage ||
        err.errors?.[0]?.message ||
        "Failed to verify email";
      Alert.alert("Verification Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!signUp) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Success", "Verification code resent! Check your email.");
    } catch (err: any) {
      Alert.alert("Error", "Failed to resend code");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          Enter the verification code sent to your email
        </Text>

        <TextInput
          label="Verification Code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          mode="outlined"
          outlineColor="#444"
          activeOutlineColor="#FF6B35"
          textColor="#fff"
          placeholder="000000"
        />

        <Button
          mode="contained"
          onPress={handleVerify}
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor="#FF6B35"
        >
          Verify Email
        </Button>

        <Button
          mode="text"
          onPress={handleResend}
          textColor="#FF6B35"
          style={styles.linkButton}
        >
          Didn't receive code? Resend
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          textColor="#ccc"
          style={styles.linkButton}
        >
          Go Back
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
    lineHeight: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#2a2a2a",
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 8,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  linkButton: {
    marginTop: 16,
  },
});
