import { StyleSheet } from "react-native";
import { colors } from "../theme";

export const timerStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: 80,
    fontWeight: "bold",
    color: colors.text.primary,
  },
});
