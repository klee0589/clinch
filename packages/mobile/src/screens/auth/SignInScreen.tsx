import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSignIn } from "@clerk/clerk-expo";
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

export function SignInScreen({ navigation }: Props) {
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleEmailCodeSignIn = async () => {
    if (!signIn || !email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      setLoading(true);

      // Start sign-in with email code
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });

      // Check if email code is supported
      const emailCodeFactor = supportedFirstFactors?.find(
        (factor: any) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        // Prepare email verification
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });

        setPendingVerification(true);
        Alert.alert("Check Your Email", "We sent you a verification code");
      } else {
        Alert.alert(
          "Error",
          "Email code sign-in not available. Try password instead.",
        );
        setUsePassword(true);
      }
    } catch (err: any) {
      console.error("Email code error:", err);
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!signIn || !code) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        Alert.alert("Error", "Verification failed");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      Alert.alert("Error", err.errors?.[0]?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSignIn = async () => {
    if (!signIn || !email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else if (result.status === "needs_first_factor") {
        const attempt = await signIn.attemptFirstFactor({
          strategy: "password",
          password,
        });

        if (attempt.status === "complete") {
          await setActive({ session: attempt.createdSessionId });
        }
      }
    } catch (err: any) {
      console.error("Password sign in error:", err);
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          {pendingVerification
            ? "Enter the code from your email"
            : usePassword
              ? "Sign in with password"
              : "Sign in with email code"}
        </Text>

        {!pendingVerification && (
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
        )}

        {usePassword && !pendingVerification && (
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
        )}

        {pendingVerification && (
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
        )}

        <Button
          mode="contained"
          onPress={
            pendingVerification
              ? handleVerifyCode
              : usePassword
                ? handlePasswordSignIn
                : handleEmailCodeSignIn
          }
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor="#FF6B35"
        >
          {pendingVerification ? "Verify Code" : "Sign In"}
        </Button>

        {!pendingVerification && (
          <Button
            mode="text"
            onPress={() => setUsePassword(!usePassword)}
            textColor="#FF6B35"
            style={styles.linkButton}
          >
            {usePassword ? "Use email code instead" : "Use password instead"}
          </Button>
        )}

        {pendingVerification && (
          <Button
            mode="text"
            onPress={() => {
              setPendingVerification(false);
              setCode("");
            }}
            textColor="#ccc"
            style={styles.linkButton}
          >
            Go Back
          </Button>
        )}

        <Button
          mode="text"
          onPress={() => navigation.navigate("SignUp")}
          textColor="#FF6B35"
          style={styles.linkButton}
        >
          Don't have an account? Sign Up
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
