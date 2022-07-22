import { View, Text, StatusBar, Modal, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth } from 'firebase/auth';
import { getDoc, doc, getFirestore } from 'firebase/firestore/lite'

const Dashboard = ({ navigation }) => {
    const auth = getAuth();
    const db=getFirestore();
    const [username, setUserName] = useState(auth.currentUser.displayName);
    const [profileImage, setProfileImage] = useState(auth.currentUser.photoURL);
    const [following,setFollowing] =useState(0)
    const [followers,setFollowers] =useState(0)
    const getProfileInfo = async () => {
        
        const doc1 = doc(db, "User", auth.currentUser.uid);
        const result = await getDoc(doc1)
        if (result.exists()) {
          const data = result.data()
          setFollowers(data.follower)
          setFollowing(data.following)
        }
    
      }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setUserName(auth.currentUser.displayName)
            setProfileImage(auth.currentUser.photoURL)
            getProfileInfo()
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar />
            <View>
                <Ionicons name="cog-outline" size={30} onPress={() => { navigation.navigate("SettingNavigator") }} color="black" style={{ padding: 5, backgroundColor: '#fff', borderRadius: 50, alignSelf: 'center', top: 20, right: 20, position: 'absolute', zIndex: 10 }} />
                <Ionicons name="share-social-outline" size={30} color="black" style={{ padding: 5, backgroundColor: '#fff', borderRadius: 50, alignSelf: 'center', top: 80, right: 20, position: 'absolute', zIndex: 10 }} />
                <Ionicons name="shuffle-outline" size={30} color="black" style={{ padding: 5, backgroundColor: '#fff', borderRadius: 50, alignSelf: 'center', top: 140, right: 20, position: 'absolute', zIndex: 10 }} />

                <Image source={{ uri: profileImage }} style={styles.profileImage} />
            </View>

            <View style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: "#fff", position: 'relative', top: -150 }}>
                <View style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>
                    <Text style={{  color: '#000',textAlign: 'center', padding: 10, margin: 10, width: "90%", marginRight: 'auto', fontSize: 20, fontWeight: '700', borderBottomColor: '#cfcfcf', borderBottomWidth: 1 }}>@ {username}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', padding: 10 }}>
                    <View style={{ flex: 1, padding: 20, margin: 10, backgroundColor: "#000", borderRadius: 5, flexDirection: 'column' }}>
                        <Text style={{ color: "#fff", textAlign: 'center', fontSize: 24 }}>{following == null ? 0 : following}</Text>
                        <Text style={{ color: "#fff", textAlign: 'center', fontSize: 10 }}>Following</Text>
                    </View>
                    <View style={{ flex: 1, padding: 20, margin: 10, backgroundColor: "#000", borderRadius: 5, flexDirection: 'column' }}>
                        <Text style={{ color: "#fff", textAlign: 'center', fontSize: 24 }}>{followers == null ? 0 : followers}</Text>
                        <Text style={{ color: "#fff", textAlign: 'center', fontSize: 10 }}>Followers</Text>
                    </View>
                    <View style={{ flex: 1, padding: 20, margin: 10, backgroundColor: "#000", borderRadius: 5, flexDirection: 'column' }}>
                        <Text style={{ color: "#fff", textAlign: 'center', fontSize: 24 }}>40</Text>
                        <Text style={{ color: "#fff", textAlign: 'center', fontSize: 10 }}>Bookmarks</Text>
                    </View>
                </View>
            </View>


            <View style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: 20, top: -150 }}>
                <View style={{ flexDirection: 'column', flex: 2 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                        <View style={{ flex: 1, padding: 15, paddingHorizontal: 25, backgroundColor: '#fff', borderColor: '#000', borderWidth: 1, borderRadius: 15, alignSelf: 'center', marginHorizontal: 10 }}>
                            <Ionicons name="code-outline" size={25} color="black" style={{ alignSelf: 'center' }} />
                            <Text style={{ fontSize: 12, textAlign: 'center' }}>Project</Text>
                        </View>
                        <View style={{ flex: 1, padding: 15, paddingHorizontal: 25, backgroundColor: '#fff', borderColor: '#000', borderWidth: 1, borderRadius: 15, alignSelf: 'center', marginHorizontal: 10 }}>
                            <Ionicons name="albums-outline" size={25} color="black" style={{ alignSelf: 'center' }} />
                            <Text style={{ fontSize: 12, textAlign: 'center' }}>Posts</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, padding: 15, paddingHorizontal: 25, backgroundColor: '#fff', borderColor: '#000', borderWidth: 1, borderRadius: 15, alignSelf: 'center', marginHorizontal: 10 }}>
                            <Ionicons name="briefcase-outline" size={25} color="black" style={{ alignSelf: 'center' }} />
                            <Text style={{ fontSize: 12, textAlign: 'center' }}>Folio</Text>
                        </View>
                        <View style={{ flex: 1, padding: 15, paddingHorizontal: 25, backgroundColor: '#fff', borderColor: '#000', borderWidth: 1, borderRadius: 15, alignSelf: 'center', marginHorizontal: 10 }}>
                            <Ionicons name="person-add-outline" size={25} color="black" style={{ alignSelf: 'center' }} />
                            <Text style={{ fontSize: 12, textAlign: 'center' }}>Colab</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <TouchableOpacity onPress={()=>navigation.navigate("BasicCamera")} style={{ flex: 1, padding: 15, paddingHorizontal: 25, backgroundColor: '#000', borderColor: '#000', borderWidth: 1, borderRadius: 15, alignSelf: 'center', marginHorizontal: 10 }}>
                        <Ionicons name="aperture-outline" size={40} color="white" style={{ alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto' }} />
                    </TouchableOpacity>

                </View>

            </View>

        </View>
    )
}


const styles = StyleSheet.create({

    textInputStyle: {
        padding: 10,
        borderColor: '#efefef',
        borderWidth: 1,
        width: "100%"
    },

    profileImage: {
        width: 450,
        height:520,
        aspectRatio: 3/4,
        resizeMode: 'cover',
    }
});

export default Dashboard