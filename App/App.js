import { LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useState, useEffect } from 'react';
import "./firebase";

import Welcome from "./screen/First/Welcome.js"
import ChooseLoginNavigator from "./screen/First/Navigator/Navigator.js"
import UniversalStack from "./screen/UniversalStack.js"

const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native - async - storage / async - storage' instead of 'react - native'. See https://github.com/react-native-async-storage/async-storage"]);
const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const auth = getAuth();
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setLoggedIn(true);

      } else {
        setLoggedIn(false);
      }
    })
  })

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {loggedIn ? (
          <Stack.Screen name="UniversalStack" component={UniversalStack} options={{headerShown:false}}/>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
            <Stack.Screen name="ChooseLoginNavigator" component={ChooseLoginNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="UniversalStack" component={UniversalStack} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App