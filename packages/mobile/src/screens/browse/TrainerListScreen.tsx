import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Searchbar, Card, Avatar, Chip } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BrowseStackParamList } from "../../navigation/types";
import { apiClient } from "../../services/api";
import { useAuth } from "@clerk/clerk-expo";

type Props = NativeStackScreenProps<BrowseStackParamList, "TrainerList">;

export function TrainerListScreen({ navigation }: Props) {
  const { getToken } = useAuth();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      const token = await getToken();
      apiClient.setAuthToken(token);
      const data = await apiClient.getTrainers();
      setTrainers(data);
    } catch (err) {
      Alert.alert("Error", "Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.user.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      trainer.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.city?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderTrainer = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TrainerDetail", { trainerId: item.id })
      }
    >
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Avatar.Image
            size={60}
            source={{
              uri:
                item.user.imageUrl ||
                "https://via.placeholder.com/60?text=" + item.user.firstName[0],
            }}
          />
          <View style={styles.trainerInfo}>
            <Text style={styles.trainerName}>
              {item.user.firstName} {item.user.lastName}
            </Text>
            <Text style={styles.trainerLocation}>
              {item.city}, {item.state}
            </Text>
            <View style={styles.chipContainer}>
              {item.specialties?.slice(0, 2).map((specialty: string) => (
                <Chip
                  key={specialty}
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {specialty}
                </Chip>
              ))}
            </View>
            <Text style={styles.trainerRate}>${item.hourlyRate}/hour</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search trainers..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        iconColor="#FF6B35"
        inputStyle={styles.searchInput}
      />
      <FlatList
        data={filteredTrainers}
        renderItem={renderTrainer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadTrainers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  searchbar: {
    margin: 16,
    backgroundColor: "#2a2a2a",
  },
  searchInput: {
    color: "#fff",
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 16,
    backgroundColor: "#2a2a2a",
  },
  cardContent: {
    flexDirection: "row",
  },
  trainerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  trainerLocation: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: "#FF6B35",
  },
  chipText: {
    color: "#fff",
    fontSize: 12,
  },
  trainerRate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B35",
  },
});
