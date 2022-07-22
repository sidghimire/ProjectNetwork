import React, { useState, useEffect } from 'react';

import { View } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Icon from 'react-native-vector-icons/Ionicons';
import ChooseLogin from '../ChooseLogin';
import Signin from '../Signin';
import Signup from '../Signup';
const Stack = createNativeStackNavigator();

const ChooseLoginNavigator = ({ navigation }) => {

    return (
        <Stack.Navigator screenOptions={{
            header: ({ navigation }) => {
                return (<View style={{ padding: 10,backgroundColor:'#fff'  }}>
                    <Icon name="arrow-back-outline" onPress={() => navigation.navigate("ChooseLogin")} size={28} color="black" />
                </View>)
            }
        }}>
            <Stack.Screen name="ChooseLogin" component={ChooseLogin} options={{
                header: ({ navigation }) => {
                    return (<View style={{ padding: 10, backgroundColor:'#fff' }}>
                        <Icon name="arrow-back-outline" onPress={() => navigation.navigate("Welcome")} size={28} color="black" />
                    </View>)
                }
            }} />
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="Signup" component={Signup} />

        </Stack.Navigator>
    );
}
export default ChooseLoginNavigator;