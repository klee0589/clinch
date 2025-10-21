import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { Card, Chip, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DashboardStackParamList } from "../../navigation/types";
import { apiClient } from "../../services/api";
import { useAuth } from "@clerk/clerk-expo";

type Props = NativeStackScreenProps<DashboardStackParamList, "BookingRequests">;

export function BookingRequestsScreen({ navigation }: Props) {
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
      const data = await apiClient.getSessions({ view: "trainer" });
      setSessions(data);
    } catch (err) {
      Alert.alert("Error", "Failed to load booking requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (sessionId: string) => {
    try {
      const token = await getToken();
      apiClient.setAuthToken(token);
      await apiClient.updateSessionStatus(sessionId, "CONFIRMED");
      Alert.alert("Success", "Booking confirmed!");
      loadSessions();
    } catch (err) {
      Alert.alert("Error", "Failed to confirm booking");
    }
  };

  const handleDecline = async (sessionId: string) => {
    try {
      const token = await getToken();
      apiClient.setAuthToken(token);
      await apiClient.updateSessionStatus(sessionId, "CANCELLED");
      Alert.alert("Success", "Booking declined");
      loadSessions();
    } catch (err) {
      Alert.alert("Error", "Failed to decline booking");
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
          <Text style={styles.traineeName}>
            {item.trainee?.user?.firstName} {item.trainee?.user?.lastName}
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

        {item.status === "PENDING" && (
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => handleAccept(item.id)}
              style={styles.acceptButton}
              buttonColor="#4CAF50"
            >
              Accept
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleDecline(item.id)}
              style={styles.declineButton}
              textColor="#F44336"
            >
              Decline
            </Button>
          </View>
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
          <Text style={styles.emptyText}>No booking requests</Text>
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
  traineeName: {
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
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  acceptButton: {
    flex: 1,
    borderRadius: 8,
  },
  declineButton: {
    flex: 1,
    borderRadius: 8,
    borderColor: "#F44336",
  },
  emptyText: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
