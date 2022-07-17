import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import UniversalStack from './Second/Navigator/BottomNavigator'
import ProfileVisit from './Second/Navigator/ProfileVisit'
import ProfileNavigator from './Second/Navigator/ProfileNavigator'
import SettingNavigator from './Setting/Navigator'

const Stack = createNativeStackNavigator();

const ChooseLoginNavigator = ({ navigation }) => {

    return (
        <Stack.Navigator >
            
            <Stack.Screen name="DashboardBottom" component={UniversalStack} options={{headerShown:false}}/>
            <Stack.Screen name="ProfileVisit" component={ProfileVisit} options={{headerShown:false}} />
            <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="SettingNavigator" component={SettingNavigator} options={{headerShown:false}}/>

        </Stack.Navigator>
    );
}
export default ChooseLoginNavigator;