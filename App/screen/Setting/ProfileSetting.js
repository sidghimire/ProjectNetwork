import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, updateDoc, doc } from "firebase/firestore/lite";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({ navigation }) => {
    const auth = getAuth();
    const db = getFirestore();
    const [userName, setUserName] = useState(auth.currentUser.displayName);
    const [displayName, setDisplayName] = useState(auth.currentUser.displayName);
    const [profileImage,setProfileImage]=useState(auth.currentUser.photoURL);
    const getFullName = async () => {
        try {
          const value = await AsyncStorage.getItem('@fullname')
          if(value !== null) {
            setDisplayName(value)
            
          }
        } catch(e) {
          // error reading value
        }
      }
    useEffect(() => {
        getFullName()
        const unsubscribe = navigation.addListener('focus', () => {
            setUserName(auth.currentUser.displayName)
            setProfileImage(auth.currentUser.photoURL)

        });
        return unsubscribe;
    }, [navigation]);
    
    const storeDisplayName = async (value) => {
        try {
          await AsyncStorage.setItem('@fullname', value)
        } catch (e) {
          // saving error
        }
      }
    const changeUsername = () => {
        updateProfile(auth.currentUser, {
            displayName: userName,
            

        }).then(() => {
        })
        createNewDB(auth.currentUser.uid)
    }
    const createNewDB = async (uid) => {
        await updateDoc(doc(db, "User", uid), {
            username: userName,
            fullname: displayName
        });
        storeDisplayName(displayName)
        alert("Username Changed");
    }
    const checkIfAllowed = () => {
        changeUsername();

    }
    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.navigate('CameraS')}>
                <Image source={{uri:profileImage}} style={{
                    resizeMode: 'cover',
                    alignSelf: 'center',
                    width: 200,
                    height: 200,
                    borderRadius: 100
                }} />
                <View style={{ position: 'relative', bottom: 50, alignSelf: 'center', backgroundColor: '#fff', borderRadius: 50 }}>
                    <Ionicons name="aperture-outline" size={30} color="black" style={{ padding: 5 }} />
                </View>
            </Pressable>
            <View style={{ flexDirection: 'column', padding: 10 }}>
                <Text style={{ marginBottom: 10, marginLeft: 10 }}>Username</Text>
                <TextInput value={userName} placeholder='Enter Your Username' style={styles.usernameInput} onChangeText={(text) => setUserName(text)} />
            </View>
            <View style={{ flexDirection: 'column', padding: 10 }}>
                <Text style={{ marginBottom: 10, marginLeft: 10 }}>Display Name</Text>
                <TextInput value={displayName} placeholder='Enter Your Name' style={styles.usernameInput} onChangeText={(text) => setDisplayName(text)} />
            </View>
            <View style={{ padding: 10 }}>
                <TouchableOpacity onPress={checkIfAllowed} style={{ width: '100%', alignSelf: 'center', borderColor: '#cdcdcd', borderWidth: 1, padding: 15, borderRadius: 10, backgroundColor: '#018B3D' }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}>
                        Update
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    usernameInput: {
        alignSelf: 'center',
        borderRadius: 10,
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: "#cdcdcd"
    }
});

export default Settings