import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { getAuth ,updateProfile} from 'firebase/auth'
import { getFirestore, doc, updateDoc } from 'firebase/firestore/lite'
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddUsername = ({navigation}) => {
    const auth = getAuth()
    const db = getFirestore()
    const [username, setUsername] = useState(auth.currentUser.displayName)
    const [fullName, setFullName]=useState("")
    const storeDisplayName = async (value) => {
        try {
            await AsyncStorage.setItem('@fullname', value)
        } catch (e) {
            // saving error
        }
    }
    const createNewDB = async () => {
        await updateDoc(doc(db, "User", auth.currentUser.uid), {
            username: username,
            fullName:fullName,

        });
        storeDisplayName(fullName)
    }

    const changeUsername = () => {
        updateProfile(auth.currentUser, {
            displayName: username,
        })
        createNewDB()

    }
    const checkIfAllowed = () => {
        if (auth.currentUser.displayName == null ) {
            changeUsername()
        }

        navigation.navigate("DashboardBottom")

    }
    return (
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={{ fontWeight: "600", fontSize: 16, margin: 20 }}>Enter Your Information:</Text>
                <TextInput style={styles.textInputStyle} value={username} onChangeText={(text) => setUsername(text)} placeholder="Enter Username" />
                <TextInput style={[styles.textInputStyle,{marginTop:30}]} value={fullName} onChangeText={(text) => setFullName(text)} placeholder="Enter FullName" />
                <TouchableOpacity style={styles.submitBtn}>
                    <Text style={{ color: '#fff', textAlign: 'center' }} onPress={checkIfAllowed}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: '100%',
        height: '100%',
        margin: 20,
        backgroundColor: "white",
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: '600',

    }
    , textInputStyle: {
        padding: 10,
        borderColor: '#efefef',
        borderWidth: 1,
        width: "100%"
    },
    submitBtn: {
        backgroundColor: '#00AB3D',
        padding: 10,
        margin: 20,
        width: "100%",
        textAlign: 'center',
        borderRadius: 5
    },
})

export default AddUsername