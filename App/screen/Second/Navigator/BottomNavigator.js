import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Dashboard from '../Dashboard';
import University from '../University';
import Search from '../Search';
import ProfileNavigator from './ProfileNavigator';

const Stack = createBottomTabNavigator();

const ChooseLoginNavigator = ({ navigation }) => {

    return (
        <Stack.Navigator>

            <Stack.Screen name="Dashboard" component={Dashboard} options={{
                headerShown: false, tabBarShowLabel:false,tabBarIcon: () => {
                    return (<Ionicons name="planet-outline" size={28} color="black" />)
                }
            }} />
            
            <Stack.Screen name="University" component={University} options={{
                headerShown: false, tabBarShowLabel:false,tabBarIcon: () => {
                    return (<Ionicons name="school-outline" size={28} color="black" />)
                }
            }} />
            <Stack.Screen name="Search" component={Search} options={{
                headerShown: false, tabBarShowLabel:false,tabBarIcon: () => {
                    return (<Ionicons name="search-circle-outline" size={28} color="black" />)
                }
            }} />
            <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} options={{

                headerShown: false, tabBarShowLabel:false,tabBarIcon: () => {
                    return (<Ionicons name="person-circle-outline" size={28} color="black" />)
                }
            }} />
            

        </Stack.Navigator>
    );
}
export default ChooseLoginNavigator;