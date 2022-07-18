import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { getAuth ,updateProfile} from 'firebase/auth'
import { getFirestore, doc, updateDoc } from 'firebase/firestore/lite'
const AddUsername = ({navigation}) => {
    const auth = getAuth()
    const db = getFirestore()
    const [username, setUsername] = useState(auth.currentUser.displayName)
    const createNewDB = async (uid) => {
        await updateDoc(doc(db, "User", uid), {
            username: username,
        });
        navigation.navigate("DashboardBottom")
    }
    const changeUsername = () => {
        updateProfile(auth.currentUser, {
            displayName: username

        })
        createNewDB(auth.currentUser.uid)
    }
    const checkIfAllowed = () => {
        alert(auth.currentUser.displayName)
        if (auth.currentUser.displayName != username || username == "" || username==null) {
            changeUsername();
        }
    }
    return (
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={{ fontWeight: "600", fontSize: 16, margin: 20 }}>Enter Your UserName:</Text>
                <TextInput style={styles.textInputStyle} value={username} onChangeText={(text) => setUsername(text)} placeholder="Enter Username" />
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