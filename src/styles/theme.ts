import { StyleSheet } from "react-native";

export const colors = {
  background: "#171923",
  surface: "#1E2132",
  surfaceLight: "#2A2F45",
  primary: "#FFD700",
  secondary: "#FFA500",
  accent: "#4CAF50",
  danger: "#f44336",
  text: {
    primary: "#FFFFFF",
    secondary: "#8F95B2",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: colors.text.primary,
  },
  h2: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: colors.text.primary,
  },
  body: {
    fontSize: 16,
    color: colors.text.primary,
  },
  caption: {
    fontSize: 12,
    color: colors.text.secondary,
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    ...typography.body,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.md,
  },
});
