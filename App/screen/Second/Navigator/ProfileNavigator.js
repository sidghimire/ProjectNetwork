import { View } from 'react-native';
import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Ionicons from 'react-native-vector-icons/Ionicons';
import Profile from '../Profile';
const Stack = createNativeStackNavigator();

const ChooseLoginNavigator = ({ navigation }) => {

  return (
    <Stack.Navigator screenOptions={{
      header: ({ navigation }) => {
        return (<View style={{ padding: 10, backgroundColor: '#fff' }}>
          <Ionicons name="arrow-back-outline" onPress={() => navigation.navigate("ChooseLogin")} size={28} color="black" />
        </View>)
      }
    }}>
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
export default ChooseLoginNavigator;