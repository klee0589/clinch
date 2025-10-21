import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DashboardStackParamList } from "./types";
import { MyBookingsScreen } from "../screens/dashboard/MyBookingsScreen";
import { BookingRequestsScreen } from "../screens/dashboard/BookingRequestsScreen";

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export function DashboardNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ title: "My Bookings" }}
      />
      <Stack.Screen
        name="BookingRequests"
        component={BookingRequestsScreen}
        options={{ title: "Booking Requests" }}
      />
    </Stack.Navigator>
  );
}
