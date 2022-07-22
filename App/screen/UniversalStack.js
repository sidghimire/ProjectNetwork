import React, { useState } from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import UniversalStack from './Second/Navigator/BottomNavigator'
import ProfileVisit from './Second/ProfileVisit'
import ProfileNavigator from './Second/Navigator/ProfileNavigator'
import SettingNavigator from './Setting/Navigator'
import AddUsername from './Second/AddUsername'
import AddImageFeed from './Second/AddImageFeed'
import PostSubmit from './Second/PostSubmit'
import { getAuth } from 'firebase/auth'
import BasicCamera from './Second/BasicCamera'
const Stack = createNativeStackNavigator();

const ChooseLoginNavigator = ({ navigation }) => {    
    const auth = getAuth()
    const [username,setUsername]=useState(auth.currentUser.displayName)
    return (
        <Stack.Navigator >
            {username!=null ?
                <></>
                : <Stack.Screen name="AddUsername" component={AddUsername} options={{ headerShown: false }} />}
            <Stack.Screen name="DashboardBottom" component={UniversalStack} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileVisit" component={ProfileVisit} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="SettingNavigator" component={SettingNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="AddImageFeed" component={AddImageFeed} options={{ headerShown: false }} />
            <Stack.Screen name="PostSubmit" component={PostSubmit} options={{ headerShown: false }} />
            <Stack.Screen name="BasicCamera" component={BasicCamera} options={{ headerShown: false }} />
            

        </Stack.Navigator>
    );
}
export default ChooseLoginNavigator;