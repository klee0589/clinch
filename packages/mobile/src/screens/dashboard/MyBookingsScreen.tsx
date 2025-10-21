import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { Card, Chip, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DashboardStackParamList } from "../../navigation/types";
import { apiClient } from "../../services/api";
import { useAuth } from "@clerk/clerk-expo";

type Props = NativeStackScreenProps<DashboardStackParamList, "MyBookings">;

export function MyBookingsScreen({ navigation }: Props) {
  const { getToken } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const token = await getToken();
      apiClient.setAuthToken(token);
      const data = await apiClient.getSessions({ view: "trainee" });
      setSessions(data);
    } catch (err) {
      Alert.alert("Error", "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#FFA500";
      case "CONFIRMED":
        return "#4CAF50";
      case "CANCELLED":
        return "#F44336";
      case "COMPLETED":
        return "#2196F3";
      default:
        return "#999";
    }
  };

  const renderSession = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.sessionHeader}>
          <Text style={styles.trainerName}>
            {item.trainer?.user?.firstName} {item.trainer?.user?.lastName}
          </Text>
          <Chip
            style={[
              styles.statusChip,
              { backgroundColor: getStatusColor(item.status) },
            ]}
            textStyle={styles.chipText}
          >
            {item.status}
          </Chip>
        </View>

        <Text style={styles.sessionDate}>
          {new Date(item.scheduledAt).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <Text style={styles.sessionTime}>
          {new Date(item.scheduledAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" • "}
          {item.duration} minutes
        </Text>

        <Text style={styles.sessionLocation}>
          {item.isOnline ? "🌐 Online" : "📍 " + item.location}
        </Text>

        <Text style={styles.sessionPrice}>${item.price.toFixed(2)}</Text>

        {item.notes && (
          <Text style={styles.sessionNotes}>Notes: {item.notes}</Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadSessions}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bookings yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: "#2a2a2a",
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statusChip: {
    height: 28,
  },
  chipText: {
    color: "#fff",
    fontSize: 12,
  },
  sessionDate: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  sessionLocation: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 8,
  },
  sessionPrice: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF6B35",
    marginBottom: 8,
  },
  sessionNotes: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  emptyText: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
