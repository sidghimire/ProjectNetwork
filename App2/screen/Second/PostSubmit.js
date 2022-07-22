import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth'
import { doc, getDocs, query, orderBy, getFirestore, updateDoc, addDoc, collection } from "firebase/firestore/lite";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, } from "firebase/storage";

const PostSubmit = ({ route, navigation }) => {
    const auth = getAuth()
    const db=getFirestore()
    const storage=getStorage()
    const { uri } = route.params
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(false)
    const [displayName, setDisplayName] = useState(auth.currentUser.displayName);

    useEffect(() => {
        getFullName()
    }, [])

    const getFullName = async () => {

        try {
            const value = await AsyncStorage.getItem('@fullname')
            if (value !== null) {
                setDisplayName(value)

            }
        } catch (e) {
            // error reading value
        }
    }
    const onUpload = async () => {
        setLoading(true)
        getFullName()
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const storageRef = ref(storage, 'postImage/' + filename)

        const resizedImage = uri;
        const response = await fetch(resizedImage)
        const blob = await response.blob()
        uploadBytes(storageRef, blob).then((snapshot) => {
            getDownloadURL(snapshot.ref).then(async (url) => {
                await addDoc(collection(db, "Posts"), {
                    status: status,
                    uid: auth.currentUser.uid,
                    date: Date.now(),
                    profileImage: auth.currentUser.photoURL,
                    fullName: displayName,
                    displayName: auth.currentUser.displayName,
                    feedImage: url
                }).then((val) => {
                    setLoading(false)

                    navigation.navigate("DashboardBottom")

                });


            })
        })

        setStatus("")

    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ position: 'absolute', top: 20, left: 20, alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 50, zIndex: 100 }}>
                <Ionicons name="arrow-back-outline" size={25} color="black" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
            </TouchableOpacity>
            <View style={{ width: '100%', height: 500, backgroundColor: 'black' }}>
                <Image source={{ uri: uri }} style={{ width: "100%", height: 500, resizeMode: 'contain', alignSelf: 'center' }} />

            </View>
            <TextInput style={styles.statusField} value={status} onChangeText={(text) => { setStatus(text) }} placeholder="What's on your mind?" multiline={true} />
            {!loading ?
                <TouchableOpacity onPress={onUpload} style={[styles.postButton, { backgroundColor: "#2871CC" }]}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>Post</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={[styles.postButton, { backgroundColor: "#fff", borderColor: '#000', borderWidth: 1 }]}>
                    <ActivityIndicator color={"#000"} size={'small'} style={{ marginLeft: 'auto', marginRight: 'auto' }} />
                </TouchableOpacity>}
        </View>
    )
}

const styles = StyleSheet.create({
    statusField: {
        borderColor: "#222222",
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        alignSelf: "center",
        padding: 15,
        borderRadius: 5,
        fontSize: 15,
        margin: 20,
        width: '90%',
    }, postButton: {
        padding: 15,
        borderRadius: 5,
        backgroundColor: "#222222",
        color: "#fff",
        bottom: 40,
        width: "90%",
        alignSelf: 'center', marginTop: 100
    }
})

export default PostSubmit