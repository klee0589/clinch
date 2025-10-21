import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MainTabParamList } from "./types";
import { BrowseNavigator } from "./BrowseNavigator";
import { DashboardNavigator } from "./DashboardNavigator";
import { ProfileNavigator } from "./ProfileNavigator";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === "Browse") {
            iconName = focused ? "account-search" : "account-search-outline";
          } else if (route.name === "Dashboard") {
            iconName = focused ? "view-dashboard" : "view-dashboard-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "account-circle" : "account-circle-outline";
          } else {
            iconName = "circle";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Browse" component={BrowseNavigator} />
      <Tab.Screen name="Dashboard" component={DashboardNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}
