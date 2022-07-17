import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { signOut, getAuth } from 'firebase/auth';


const Settings = ({navigation}) => {
  const auth = getAuth();

  return (
    <View style={styles.container}>
      <Pressable onPress={()=>navigation.navigate("ProfileSetting")} style={{ flexDirection: 'row' }}>
        <View style={{  padding: 10 }}>
          <Ionicons name="person-circle-outline" onPress={() => navigation.goBack()} size={25} color="#3880FF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{textAlignVertical:'center',padding:15,fontSize:15}}>Profile Setting</Text>
        </View>
      </Pressable>
      <Pressable onPress={()=>signOut(auth)} style={{ flexDirection: 'row' }}>
        <View style={{  padding: 10 }}>
          <Ionicons name="exit-outline" onPress={() => navigation.goBack()} size={25} color="#222222" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{textAlignVertical:'center',padding:15,fontSize:15}}>Log Out</Text>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default Settings