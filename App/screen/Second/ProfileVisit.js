import { View, Text, StatusBar, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, Image, RefreshControl, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LogBox } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getAuth } from 'firebase/auth';
import { getDoc, doc, getFirestore, query, where, orderBy, collection, getDocs } from 'firebase/firestore/lite'
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
LogBox.ignoreLogs(["source.uri should not be an empty string"]);

const Dashboard = ({ route, navigation }) => {
  const { userID } = route.params;

  const auth = getAuth();
  const db = getFirestore();
  const [username, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [DATA, setDATA] = useState([{ id: 'POST' }])
  const [downloading, setDownloading] = useState(true)
  const [feedDownloading, setFeedDownloadin] = useState(true)

  const getPosts = async () => {
    const q = query(collection(db, "Posts"), where("uid", "==", userID), orderBy('date', 'desc'))
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
    setFeedDownloadin(false)
  }



  const getProfileInfo = async () => {
    console.log(userID)
    const doc1 = doc(db, "User", userID);
    const result = await getDoc(doc1)
    if (result.exists()) {
      const data = result.data()
      setProfileImage(data.profileImage)
      setUserName(data.username)
    }
    setDownloading(false)

  }
  useEffect(() => {
    getProfileInfo()
    getPosts()


  }, [navigation]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {

    setRefreshing(true);

    getPosts()
    wait(1000).then(() => setRefreshing(false));
  }, []);
  const renderItem = ({ item, index }) => {

    if (index == 0) {
      return (
        <View style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: "#fff", }}>
          <View style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>
            <Text style={{ color: '#000', textAlign: 'center', padding: 10, margin: 10, width: "90%", marginRight: 'auto', fontSize: 20, fontWeight: '700', borderBottomColor: '#cfcfcf', borderBottomWidth: 1 }}>@ {username}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', padding: 10 }}>
            <View style={{ flex: 1, padding: 20, margin: 10, backgroundColor: "#000", borderRadius: 5, flexDirection: 'column' }}>
              <Text style={{ color: "#fff", textAlign: 'center', fontSize: 24 }}>10000</Text>
              <Text style={{ color: "#fff", textAlign: 'center', fontSize: 10 }}>Following</Text>
            </View>
            <View style={{ flex: 1, padding: 20, margin: 10, backgroundColor: "#000", borderRadius: 5, flexDirection: 'column' }}>
              <Text style={{ color: "#fff", textAlign: 'center', fontSize: 24 }}>33M</Text>
              <Text style={{ color: "#fff", textAlign: 'center', fontSize: 10 }}>Followers</Text>
            </View>
            <View style={{ flex: 1, padding: 20, margin: 10, backgroundColor: "#000", borderRadius: 5, flexDirection: 'column' }}>
              <Text style={{ color: "#fff", textAlign: 'center', fontSize: 24 }}>40</Text>
              <Text style={{ color: "#fff", textAlign: 'center', fontSize: 10 }}>Bookmarks</Text>
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Item uid={item.uid} id={item.id} fullName={item.fullName} date={item.date} username={item.username} displayName={item.displayName} description={item.description} profileImage={item.profileImage} />
        </View>
      )
    }


  };
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
        <Image style={styles.feedImage} source={{ uri: profileImage }} />
        <View style={{ paddingHorizontal: 10, display: 'flex', flexDirection: 'column', width: "100%" }}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>

            <Text style={{ fontSize: 16, color: 'black', fontWeight: '800' }}>{fullName}</Text>
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
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar />
      {downloading ?
        <View style={{ zindex: 100, width: '100%', height: '100%', backgroundColor: '#fff' }}>
          <Ionicons name="arrow-back-outline" size={30} onPress={() => { navigation.goBack() }} color="black" style={{ padding: 5, backgroundColor: '#fff', borderRadius: 50, alignSelf: 'center', top: 20, left: 20, position: 'absolute', zIndex: 10 }} />

          <ActivityIndicator animating={downloading} size="large" color="#000000" style={{ position: 'absolute', top: '50%', alignSelf: 'center', zIndex: 100 }} />
        </View>
        : <></>}

      <View style={{ backgroundColor: 'black' }}>
        <Ionicons name="arrow-back-outline" size={30} onPress={() => { navigation.goBack() }} color="black" style={{ padding: 5, backgroundColor: '#fff', borderRadius: 50, alignSelf: 'center', top: 20, left: 20, position: 'absolute', zIndex: 10 }} />

        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      </View>



      <SafeAreaView style={{ position: 'relative', top: -250, paddingBottom: 250, backgroundColor: 'white' }}>
        <ActivityIndicator animating={feedDownloading} size="large" color="#000000" style={{ position: 'absolute', bottom: 100, alignSelf: 'center', zIndex: 100 }} />

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

  textInputStyle: {
    padding: 10,
    borderColor: '#efefef',
    borderWidth: 1,
    width: "100%"
  },

  profileImage: {
    width: 450,
    height: 520,
    aspectRatio: 3 / 4,
    resizeMode: 'cover',
  }, item: {
    padding: 20,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  title: {
    fontSize: 26,
    fontWeight: "500",
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
});

export default Dashboard