import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BrowseStackParamList } from "./types";
import { TrainerListScreen } from "../screens/browse/TrainerListScreen";
import { TrainerDetailScreen } from "../screens/browse/TrainerDetailScreen";
import { BookSessionScreen } from "../screens/browse/BookSessionScreen";

const Stack = createNativeStackNavigator<BrowseStackParamList>();

export function BrowseNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TrainerList"
        component={TrainerListScreen}
        options={{ title: "Find Trainers" }}
      />
      <Stack.Screen
        name="TrainerDetail"
        component={TrainerDetailScreen}
        options={{ title: "Trainer Profile" }}
      />
      <Stack.Screen
        name="BookSession"
        component={BookSessionScreen}
        options={{ title: "Book Session" }}
      />
    </Stack.Navigator>
  );
}
