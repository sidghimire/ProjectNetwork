import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { doc, getDocs, query, where, getFirestore, updateDoc, collection } from "firebase/firestore/lite";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, } from "firebase/storage";
import { updateProfile, getAuth } from 'firebase/auth';


const CameraFilter = ({ route, navigation }) => {
  const { uri } = route.params
  const auth = getAuth()
  const storage = getStorage()
  const db = getFirestore()

  const uploadPhoto = async () => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, 'profileImages/' + filename)
    
    const resizedImage = uri;
    const response = await fetch(resizedImage)
    const blob = await response.blob()


    if (auth.currentUser.photoURL == "" || auth.currentUser.photoURL == null) {
      uploadBytes(storageRef, blob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          let q = query(collection(db, 'Posts'), where("uid", "==", auth.currentUser.uid))
          const querySnapshot = await getDocs(q)
          querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
              profileImage: url
            })
          })
          let q2 = doc(db, 'User', auth.currentUser.uid)
          await updateDoc(q2, {
            profileImage: url
          })
          updateProfile(auth.currentUser, {
            photoURL: url
          })
          navigation.navigate('Profile')
        })
      })
    } else {
      const deleteRef = ref(storage, auth.currentUser.photoURL)
      deleteObject(deleteRef).then(() => {
        uploadBytes(storageRef, blob).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            let q = query(collection(db, 'Posts'), where("uid", "==", auth.currentUser.uid))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
              updateDoc(doc.ref, {
                profileImage: url
              })
            })
            let q2 = doc(db, 'User', auth.currentUser.uid)
            await updateDoc(q2, {
              profileImage: url
            })
            updateProfile(auth.currentUser, {
              photoURL: url
            })
            navigation.navigate('Profile')
          })
        })
      })


    }

  }
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ position: 'absolute', top: 20, left: 20, alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 50, zIndex: 100 }}>
        <Ionicons name="arrow-back-outline" size={25} color="black" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
      </TouchableOpacity>
      <Image source={{ uri: uri }} style={{ flex: 1 }} />
      <View style={{ position: 'absolute', bottom: 0, padding: 20, width: '100%' }}>
        <TouchableOpacity onPress={uploadPhoto} style={{ backgroundColor: '#007BF7', width: '100%', borderRadius: 50, display: 'flex', flexDirection: 'row', padding: 10, alignSelf: 'center' }}>
          <Text style={{ fontSize: 20, marginLeft: 20, marginBottom: 'auto', marginTop: 'auto', color: 'white', fontWeight: '600', marginLeft: 'auto' }}>
            Change Profile
          </Text>
          <Ionicons name="caret-up-outline" size={25} color="white" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto' }} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CameraFilter