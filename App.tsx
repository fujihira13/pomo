import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Home } from "./src/components/Home";
import { CreateTask } from "./src/components/CreateTask";
import { TimerScreen } from "./src/components/TimerScreen";
import type { Task } from "./src/components/TaskList";

export type RootStackParamList = {
  Home: undefined;
  CreateTask: undefined;
  Timer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskSelect = (
    task: Task,
    navigation: NativeStackNavigationProp<RootStackParamList>
  ) => {
    setSelectedTask(task);
    navigation.navigate("Timer");
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: styles.container,
        }}
      >
        <Stack.Screen name="Home">
          {({ navigation }) => (
            <Home
              navigation={navigation}
              onTaskSelect={(task) => handleTaskSelect(task, navigation)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="CreateTask" component={CreateTask} />
        <Stack.Screen name="Timer">
          {({ navigation }) => {
            if (!selectedTask) {
              navigation.navigate("Home");
              return null;
            }
            return (
              <TimerScreen
                task={selectedTask}
                onBack={() => {
                  setSelectedTask(null);
                  navigation.navigate("Home");
                }}
              />
            );
          }}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171923",
  },
});
