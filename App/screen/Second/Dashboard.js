import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, TextInput, Image, Modal, StatusBar, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { signOut, getAuth, updateProfile } from 'firebase/auth';
import { doc, getDocs, query, orderBy, getFirestore, updateDoc, addDoc, collection } from "firebase/firestore/lite";
import AsyncStorage from '@react-native-async-storage/async-storage';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


const Dashboard = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(false)

  const onRefresh = React.useCallback(() => {

    setRefreshing(true);

    getPosts()
    wait(1000).then(() => setRefreshing(false));
  }, []);
  const auth = getAuth();
  const db = getFirestore();

  const [DATA, setDATA] = useState([{ id: 'POST' }])

  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState(auth.currentUser.displayName);
  const [profileImage, setProfileImage] = useState(auth.currentUser.photoURL);
  const [displayName, setDisplayName] = useState(auth.currentUser.displayName);
  const [downloading, setDownloading] = useState(true)
  const [status, setStatus] = useState("");
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
  const addStatus = async () => {
    setLoading(true)
    getFullName()
    await addDoc(collection(db, "Posts"), {
      status: status,
      uid: auth.currentUser.uid,
      date: Date.now(),
      profileImage: auth.currentUser.photoURL,
      displayName: auth.currentUser.displayName,
      fullName: displayName

    }).then((val) => {
      console.log(val.id)
    });
    setStatus("")
    onRefresh()
    setLoading(false)

  }
  const onUpload = () => {
    addStatus()
  }
  const getPosts = async () => {
    setDownloading(true)
    const q = query(collection(db, "Posts"), orderBy("date", "desc"))
    const querySnapshot = await getDocs(q)
    setDATA([{ id: 'POST' }])
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      let dataOne = {
        id: doc.id,
        username: data.displayName,
        description: data.status,
        profileImage: data.profileImage,
        date: data.date,
        fullName: data.fullName,
        uid: data.uid
      }


      if (DATA.includes(dataOne, 0)) {
      } else {
        setDATA(arr => [...arr, dataOne]);
      }
    })
    setDownloading(false)
  }

  useEffect(() => {

    getFullName()
    getPosts()
    const unsubscribe = navigation.addListener('focus', () => {
      setUserName(auth.currentUser.displayName)
      setProfileImage(auth.currentUser.photoURL)

    });
    if (auth.currentUser.displayName == null) {
      setModalVisible(true);
    }
    return unsubscribe;
  }, [navigation]);
  const changeUsername = () => {
    updateProfile(auth.currentUser, {
      displayName: userName

    }).then(() => {
      setModalVisible(false);
    })
    createNewDB(auth.currentUser.uid)
  }
  const createNewDB = async (uid) => {
    await updateDoc(doc(db, "User", uid), {
      username: userName,
    });
  }
  const checkIfAllowed = () => {
    if (auth.currentUser.displayName != userName) {
      changeUsername();
    }
  }

  const Item = ({ uid, id, username, description, profileImage, date, fullName }) => {
    let diff = Date.now() - date;
    let postfix = "sec"
    let time = parseInt(diff / 1000)
    if (time > 60 && time < 3600) {
      time = parseInt(time / 60)
      postfix = "min"
    }
    else if (time > 3600 & time < 86400) {
      time = parseInt(time / 3600)
      postfix = "hour"
    }
    else if (time > 86400 & time < (86400 * 7)) {
      time = parseInt(time / 86400)
      postfix = "day"
    }
    else if (time > (86400 * 7)) {
      time = parseInt(time / (86400 * 7))
      postfix = "week"
    }
    return (

      <View style={styles.item}>
        <TouchableOpacity onPress={() => navigation.navigate("ProfileVisit", { userID: uid })}>
          <Image style={styles.feedImage} source={{ uri: profileImage }} />
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 10, display: 'flex', flexDirection: 'column', width: "100%" }}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => navigation.navigate("ProfileVisit", { userID: uid })}>
              <Text style={{ fontSize: 16, color: 'black', fontWeight: '800' }}>{fullName}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 14, color: '#404040', marginLeft: 4 }}>@{username}</Text>
            <Text style={{ fontSize: 14, color: '#808080', marginLeft: "auto", marginRight: 50 }}>{time} {postfix}</Text>
          </View>
          <View style={{ width: '94%', paddingLeft: 10 }}>
            <Text style={{ textAlign: 'justify', fontSize: 15 }}>
              {description}
            </Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', width: "100%" }}>
            <View style={{ display: 'flex', flexDirection: 'row', paddingVertical: 5, paddingRight: 20 }}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TouchableOpacity style={styles.postButtons}>
                  <Ionicons name="heart-outline" size={25} color="black" />
                </TouchableOpacity>
                <Text style={{ margin: 5, marginTop: 7, fontSize: 16 }}></Text>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', paddingVertical: 5, paddingRight: 20, marginLeft: 'auto', marginRight: 20 }}>
              <TouchableOpacity style={[styles.postButtons]}>
                <Ionicons name="earth-outline" size={25} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.postButtons}>
                <Ionicons name="chatbox-ellipses-outline" size={25} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  };
  const renderItem = ({ item, index }) => {
    if (index == 0) {
      return (
        <View style={{ paddingBottom: 10, marginBottom: 20 }}>
          <View style={{ display: 'flex', flexDirection: 'row', padding: 10, paddingTop: 0 }}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <TextInput style={styles.statusField} value={status} onChangeText={(text) => { setStatus(text) }} placeholder="What's on your mind?" multiline={true} />
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TouchableOpacity style={{ flex: 1 }}>
              <Ionicons name="earth-outline" size={25} color="green" style={{ alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto' }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}>
              <Ionicons name="send-outline" size={25} color="blue" style={{ alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto' }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}>
              <Ionicons name="image-outline" size={25} color="red" style={{ alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto' }} />
            </TouchableOpacity>
            {!loading ?
              <TouchableOpacity onPress={onUpload} style={[styles.postButton, { flex: 3, backgroundColor: "#2871CC" }]}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Post</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={[styles.postButton, { flex: 3, backgroundColor: "#fff", borderColor: '#000', borderWidth: 1 }]}>
                <ActivityIndicator color={"#000"} size={'small'} style={{ marginLeft: 'auto', marginRight: 'auto' }} />
              </TouchableOpacity>}
          </View>
        </View>
      )
    } else {
      return (
        <Item uid={item.uid} id={item.id} fullName={item.fullName} date={item.date} username={item.username} displayName={item.displayName} description={item.description} profileImage={item.profileImage} />
      )
    }

  };


  return (
    <View style={{ backgroundColor: 'white', flex: 1, paddingRight: 5 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <Text style={styles.modalText}>Complete Your Profile To Continue</Text>
            <Text>Enter Your UserName:</Text>
            <TextInput style={styles.textInputStyle} value={userName} onChangeText={(text) => setUserName(text)} placeholder="Enter Username" />
            <TouchableOpacity style={styles.submitBtn}>
              <Text style={{ color: '#fff', textAlign: 'center' }} onPress={checkIfAllowed}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <StatusBar />
      <View style={{ padding: 20, paddingTop: 15 }}>
        <Text style={styles.title}>
          Expo
        </Text>
      </View>
      <ActivityIndicator animating={downloading} size="large" color="#000000" style={{ position: 'absolute', top: '50%', alignSelf: 'center' }} />

      <SafeAreaView style={{ paddingBottom: 50 }}>

        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </SafeAreaView>
    </View>

  )
}
const styles = StyleSheet.create({
  item: {
    padding: 20,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  title: {
    fontSize: 26,
    fontWeight: "500",
    color: '#000'
  },
  statusField: {
    borderColor: "#222222",
    borderWidth: 1,
    alignSelf: "center",
    padding: 15,
    borderRadius: 5,
    fontSize: 15,
    flex: 1
  },
  profileImage:
  {
    width: 60,
    height: 60,
    margin: 10,
    borderRadius: 50
  },
  postButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#222222",
    color: "#fff",
    flex: 1,
    marginHorizontal: 10
  }, centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width: '75%',
    height: '75%',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
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
  feedImage: {
    width: 50,
    height: 50,
    borderRadius: 40
  },
  postButtons: {
    margin: 5,
    marginLeft: 10
  }

})

export default Dashboard