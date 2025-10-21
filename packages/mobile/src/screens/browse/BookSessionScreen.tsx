import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button, Switch } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BrowseStackParamList } from "../../navigation/types";
import { apiClient } from "../../services/api";
import { useAuth, useUser } from "@clerk/clerk-expo";

type Props = NativeStackScreenProps<BrowseStackParamList, "BookSession">;

export function BookSessionScreen({ route, navigation }: Props) {
  const { trainerId } = route.params;
  const { getToken } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [trainer, setTrainer] = useState<any>(null);
  const [traineeProfile, setTraineeProfile] = useState<any>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = await getToken();
      apiClient.setAuthToken(token);

      const [trainerData, profileData] = await Promise.all([
        apiClient.getTrainerById(trainerId),
        apiClient.getTraineeProfile(user?.id || ""),
      ]);

      setTrainer(trainerData);
      setTraineeProfile(profileData);
    } catch (err) {
      Alert.alert("Error", "Failed to load booking information");
    }
  };

  const calculatePrice = () => {
    if (!trainer || !duration) return 0;
    return trainer.hourlyRate * (parseInt(duration) / 60);
  };

  const handleBookSession = async () => {
    if (!date || !time || !duration) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!traineeProfile) {
      Alert.alert(
        "Error",
        "You need a trainee profile to book sessions. Please complete your profile first.",
      );
      return;
    }

    if (!isOnline && !location) {
      Alert.alert("Error", "Please specify a location for in-person sessions");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      apiClient.setAuthToken(token);

      const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

      await apiClient.createSession({
        trainerId,
        traineeId: traineeProfile.id,
        scheduledAt,
        duration: parseInt(duration),
        price: calculatePrice(),
        location: isOnline ? "Online" : location,
        isOnline,
        notes,
      });

      Alert.alert("Success", "Session booked successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("TrainerList"),
        },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to book session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {trainer && (
          <View style={styles.trainerInfo}>
            <Text style={styles.trainerName}>
              {trainer.user.firstName} {trainer.user.lastName}
            </Text>
            <Text style={styles.trainerRate}>${trainer.hourlyRate}/hour</Text>
          </View>
        )}

        <TextInput
          label="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          placeholder="2025-01-15"
          style={styles.input}
          mode="outlined"
          outlineColor="#444"
          activeOutlineColor="#FF6B35"
          textColor="#fff"
        />

        <TextInput
          label="Time (HH:MM)"
          value={time}
          onChangeText={setTime}
          placeholder="14:00"
          style={styles.input}
          mode="outlined"
          outlineColor="#444"
          activeOutlineColor="#FF6B35"
          textColor="#fff"
        />

        <TextInput
          label="Duration (minutes)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="60"
          style={styles.input}
          mode="outlined"
          outlineColor="#444"
          activeOutlineColor="#FF6B35"
          textColor="#fff"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Online Session</Text>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            color="#FF6B35"
          />
        </View>

        {!isOnline && (
          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Enter session location"
            style={styles.input}
            mode="outlined"
            outlineColor="#444"
            activeOutlineColor="#FF6B35"
            textColor="#fff"
          />
        )}

        <TextInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          placeholder="Any special requests or notes..."
          style={styles.input}
          mode="outlined"
          outlineColor="#444"
          activeOutlineColor="#FF6B35"
          textColor="#fff"
        />

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Price:</Text>
          <Text style={styles.price}>${calculatePrice().toFixed(2)}</Text>
        </View>

        <Button
          mode="contained"
          onPress={handleBookSession}
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor="#FF6B35"
        >
          Confirm Booking
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  content: {
    padding: 20,
  },
  trainerInfo: {
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  trainerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  trainerRate: {
    fontSize: 16,
    color: "#FF6B35",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#2a2a2a",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: "#fff",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 18,
    color: "#fff",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  button: {
    borderRadius: 8,
  },
});
