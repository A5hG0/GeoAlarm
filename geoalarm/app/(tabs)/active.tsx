import { View, Text, StyleSheet } from 'react-native';

export default function ActiveScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Active — No alarm running</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
});