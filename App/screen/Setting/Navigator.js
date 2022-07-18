import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SettingList from "../Setting/Settings"
import ProfileSetting from "../Setting/ProfileSetting"
import Camera from './Camera'
import CameraCrop from './CameraCrop'
import CameraSubmit from './CameraSubmit'
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();


const Navigator = ({ navigation }) => {

  return (
    <Stack.Navigator >
      <Stack.Screen name="SettingList" component={SettingList} options={{
        header: ({ navigation }) => {
          return (<View style={{ padding: 10, backgroundColor: '#fff', flexDirection: 'row', borderBottomColor: '#efefef', borderBottomWidth: 1 }}>
            <Ionicons name="arrow-back-outline" onPress={() => navigation.goBack()} size={28} color="black" />
            <View>
              <Text style={{ color: '#000', fontSize: 22, marginLeft: 22 }}>Settings</Text>
            </View>
          </View>)
        }
      }} />
      <Stack.Screen name="ProfileSetting" component={ProfileSetting} options={{
        header: ({ navigation }) => {
          return (<View style={{ padding: 10, backgroundColor: '#fff', flexDirection: 'row', borderBottomColor: '#efefef', borderBottomWidth: 1 }}>
            <Ionicons name="arrow-back-outline" onPress={() => navigation.goBack()} size={28} color="black" />
            <View>
              <Text style={{ color: '#000', fontSize: 22, marginLeft: 22 }}>Profile Setting</Text>
            </View>
          </View>)
        }
      }} />
      <Stack.Screen name="CameraS" component={Camera} options={{
    headerShown:false
      }} />
      <Stack.Screen name="CameraCrop" component={CameraCrop} options={{
        headerShown:false
      }} />
      <Stack.Screen name="CameraSubmit" component={CameraSubmit} options={{
        headerShown:false
      }} />
    </Stack.Navigator>
  )
}

export default Navigator