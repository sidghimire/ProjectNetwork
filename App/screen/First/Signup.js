import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import "../../firebase";
import { doc, setDoc, getFirestore } from "firebase/firestore/lite";


const Signup = ({ navigation }) => {
    const auth = getAuth();
    const db = getFirestore();
    const [email, setEmail] = useState("email@gmail.com");
    const [password, setPassword] = useState("password");
    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (msg) => {
                await createNewDB(msg.user.uid);
                navigation.navigate("UniversalStack");
            })
    }
    const createNewDB = async (uid) => {
        await setDoc(doc(db, "User", uid), {
            username: "",
            email: email,
        })
    }
    return (
        <View style={styles.container}>
            <Text>Sign Up</Text>
            <TextInput style={styles.inputs} placeholder="Email" value={email} onChangeText={(text) => setEmail(text)} />
            <TextInput style={styles.inputs} placeholder="Password" value={password} onChangeText={(text) => setPassword(text)} />
            <TouchableOpacity onPress={handleSignUp} style={{ padding: 20, backgroundColor: "#dfdfdf" }}><Text style={{ fontSize: 30 }}>Sign Up</Text></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputs: {
        padding: 5,
        borderColor: 'grey',
        borderWidth: 1,
        margin: 10,
        width: '80%'
    }
});

export default Signup