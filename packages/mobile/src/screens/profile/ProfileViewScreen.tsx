import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Avatar, Button, List, Divider } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { useUser, useClerk } from "@clerk/clerk-expo";

type Props = NativeStackScreenProps<ProfileStackParamList, "ProfileView">;

export function ProfileViewScreen({ navigation }: Props) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={100}
          source={{
            uri:
              user?.imageUrl ||
              "https://via.placeholder.com/100?text=" + user?.firstName?.[0],
          }}
        />
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <Divider style={styles.divider} />

      <List.Section>
        <List.Item
          title="Edit Profile"
          description="Update your profile information"
          left={(props) => (
            <List.Icon {...props} icon="account-edit" color="#FF6B35" />
          )}
          onPress={() => navigation.navigate("EditProfile")}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
        />
        <Divider style={styles.divider} />

        <List.Item
          title="Settings"
          description="App preferences and notifications"
          left={(props) => <List.Icon {...props} icon="cog" color="#FF6B35" />}
          onPress={() => navigation.navigate("Settings")}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
        />
        <Divider style={styles.divider} />

        <List.Item
          title="Help & Support"
          description="Get help or contact support"
          left={(props) => (
            <List.Icon {...props} icon="help-circle" color="#FF6B35" />
          )}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
        />
        <Divider style={styles.divider} />

        <List.Item
          title="About"
          description="App version and information"
          left={(props) => (
            <List.Icon {...props} icon="information" color="#FF6B35" />
          )}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
        />
      </List.Section>

      <Button
        mode="outlined"
        onPress={handleSignOut}
        style={styles.signOutButton}
        textColor="#F44336"
      >
        Sign Out
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
    padding: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
  },
  email: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 4,
  },
  divider: {
    backgroundColor: "#444",
  },
  listTitle: {
    color: "#fff",
  },
  listDescription: {
    color: "#ccc",
  },
  signOutButton: {
    margin: 20,
    borderRadius: 8,
    borderColor: "#F44336",
  },
});
