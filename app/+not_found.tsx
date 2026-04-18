import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Page Not Found" }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>📚</Text>
        <Text style={styles.title}>This page doesn&apos;t exist</Text>
        <Text style={styles.description}>
          Looks like you&apos;re lost in your studies. Let&apos;s get back to learning!
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to My Cards</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 300,
  },
  link: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});
