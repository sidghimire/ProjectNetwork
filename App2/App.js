import { LogBox, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useState, useEffect } from 'react';
import "./firebase";

import Welcome from "./screen/First/Welcome.js"
import ChooseLoginNavigator from "./screen/First/Navigator/Navigator.js"
import UniversalStack from "./screen/UniversalStack.js"

const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"]);
const App = () => {
  const [loggedIn, setLoggedIn] = useState(null);
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user == null) {
      setLoggedIn(false)
    }
    else {
      setLoggedIn(true)
    }
  })

  

  if (loggedIn==true) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="UniversalStack" component={UniversalStack} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  } else if(loggedIn==false) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
          <Stack.Screen name="ChooseLoginNavigator" component={ChooseLoginNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  else if(loggedIn==null){
    return(
      <View style={{flex:1,backgroundColor:'#fff'}}>

      </View>
    )
  }
}

export default App