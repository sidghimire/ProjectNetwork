import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const First = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Welcome</Text>
      <TouchableOpacity onPress={()=>navigation.navigate("ChooseLoginNavigator")} style={{ padding: 20, backgroundColor: "#dfdfdf" }}><Text style={{ fontSize: 30 }}>Next</Text></TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default First