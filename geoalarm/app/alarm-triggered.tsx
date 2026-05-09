import { View, Text, StyleSheet } from 'react-native';

export default function AlarmTriggeredScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wake Up!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff3b30' },
  text: { fontSize: 32, color: 'white', fontWeight: 'bold' },
});