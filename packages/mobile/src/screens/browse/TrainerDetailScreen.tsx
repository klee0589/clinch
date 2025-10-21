import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Avatar, Chip, Divider } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BrowseStackParamList } from "../../navigation/types";
import { apiClient } from "../../services/api";
import { useAuth } from "@clerk/clerk-expo";

type Props = NativeStackScreenProps<BrowseStackParamList, "TrainerDetail">;

export function TrainerDetailScreen({ route, navigation }: Props) {
  const { trainerId } = route.params;
  const { getToken } = useAuth();
  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainer();
  }, []);

  const loadTrainer = async () => {
    try {
      const token = await getToken();
      apiClient.setAuthToken(token);
      const data = await apiClient.getTrainerById(trainerId);
      setTrainer(data);
    } catch (err) {
      Alert.alert("Error", "Failed to load trainer details");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !trainer) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={100}
          source={{
            uri:
              trainer.user.imageUrl ||
              "https://via.placeholder.com/100?text=" +
                trainer.user.firstName[0],
          }}
        />
        <Text style={styles.name}>
          {trainer.user.firstName} {trainer.user.lastName}
        </Text>
        <Text style={styles.location}>
          {trainer.city}, {trainer.state}
        </Text>
        <Text style={styles.rate}>${trainer.hourlyRate}/hour</Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{trainer.bio || "No bio available"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <Text style={styles.text}>{trainer.experienceYears} years</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specialties</Text>
        <View style={styles.chipContainer}>
          {trainer.specialties?.map((specialty: string) => (
            <Chip
              key={specialty}
              style={styles.chip}
              textStyle={styles.chipText}
            >
              {specialty}
            </Chip>
          ))}
        </View>
      </View>

      {trainer.certifications && trainer.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {trainer.certifications.map((cert: string, index: number) => (
            <Text key={index} style={styles.text}>
              • {cert}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <Text style={styles.text}>
          {trainer.availableForOnline
            ? "✓ Online sessions"
            : "✗ Online sessions"}
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("BookSession", { trainerId })}
        style={styles.bookButton}
        buttonColor="#FF6B35"
      >
        Book Session
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 12,
  },
  location: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 4,
  },
  rate: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF6B35",
    marginTop: 8,
  },
  divider: {
    backgroundColor: "#444",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: "#ccc",
    lineHeight: 24,
  },
  text: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#FF6B35",
  },
  chipText: {
    color: "#fff",
  },
  bookButton: {
    margin: 20,
    borderRadius: 8,
  },
  loadingText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
  },
});
