import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomEmpty = () => (
  <View style={styles.container}>
    {/* <Text style={styles.text}>Create a New project!</Text> */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E1528', // Customize the background color here
  },
  text: {
    fontSize: 18,
    color: 'lightgray', // Customize the text color here
  },
});

export default CustomEmpty