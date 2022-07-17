import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React,{useState} from 'react'
import {getAuth,signInWithEmailAndPassword} from 'firebase/auth'
import "../../firebase";

const Signin = ({ navigation }) => {
    const auth=getAuth();
    const [email,setEmail]=useState("email@gmail.com");
    const [password,setPassword]=useState("password");
    const handleSignUp=()=>{
        signInWithEmailAndPassword(auth,email,password)
        .then((msg)=>{
            navigation.navigate("UniversalStack")
        })
    }
    return (
        <View style={styles.container}>
            <Text>Sign In</Text>
            <TextInput style={styles.inputs} placeholder="Email" value={email} onChangeText={(text)=>setEmail(text)} />
            <TextInput style={styles.inputs} placeholder="Password" value={password} onChangeText={(text)=>setPassword(text)}/>
            <TouchableOpacity onPress={handleSignUp} style={{ padding: 20, backgroundColor: "#dfdfdf" }}><Text style={{ fontSize: 30 }}>Sign In</Text></TouchableOpacity>
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
    inputs:{
        padding:5,
        borderColor:'grey',
        borderWidth:1,
        margin:10,
        width:'80%'
    }
});

export default Signin