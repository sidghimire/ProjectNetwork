import { View, Text, StatusBar, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, Image, RefreshControl, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LogBox } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getAuth } from 'firebase/auth';
import { getDoc, doc, getFirestore, query, where, orderBy, collection, getDocs, increment, updateDoc, arrayRemove, arrayUnion, setDoc } from 'firebase/firestore/lite'
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
  const [DATA, setDATA] = useState([])
  const [downloading, setDownloading] = useState(true)
  const [feedDownloading, setFeedDownloadin] = useState(true)
  const [following, setFollowing] = useState(0)
  const [followers, setFollowers] = useState(0)
  const [followed, setFollowed] = useState([])

  const followUser = async () => {
    setFollowed(!followed)
    setFollowers(followers + 1)

    const ref0 = doc(db, 'Followers', userID)
    const ref1 = doc(db, 'User', userID)
    const ref2 = doc(db, 'User', auth.currentUser.uid)
    await getDoc(ref0).then(async (q1) => {
      if (q1.exists() == false) {
        await setDoc(doc(db, 'Followers', userID), {
          followers: 0,
          following: 0,
          uid: userID
        })
      }
    })
    await updateDoc(ref0, {
      followers: arrayUnion(auth.currentUser.uid)
    })
    await updateDoc(ref1, {
      follower: increment(1)
    })
    await updateDoc(ref2, {
      following: increment(1)
    })

  }
  const unfollowUser = async () => {
    setFollowed(!followed)
    setFollowers(followers - 1)

    const ref0 = doc(db, 'Followers', userID)
    const ref1 = doc(db, 'User', userID)
    const ref2 = doc(db, 'User', auth.currentUser.uid)

    await getDoc(ref0).then(async (q1) => {
      if (q1.exists() == false) {
        await setDoc(doc(db, 'Followers', userID), {
          followers: 0,
          following: 0,
          uid: userID
        })
      }
    })
    await updateDoc(ref0, {
      followers: arrayRemove(auth.currentUser.uid)
    })
    await updateDoc(ref1, {
      follower: increment(-1)
    })
    await updateDoc(ref2, {
      following: increment(-1)
    })
  }

  const getPosts = async () => {
    const q = query(collection(db, "Posts"), where("uid", "==", userID), orderBy('date', 'desc'))
    const querySnapshot = await getDocs(q)
    setDATA([])
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      let dataOne = {
        id: doc.id,
        username: data.displayName,
        description: data.status,
        profileImage: data.profileImage,
        date: data.date,
        fullName: data.fullName,
        uid: data.uid,
        feedImage: data.feedImage
      }


      if (DATA.includes(dataOne, 0)) {
      } else {
        setDATA(arr => [...arr, dataOne]);
      }
    })
    setFeedDownloadin(false)
  }



  const getProfileInfo = async () => {
    const ref1 = collection(db, 'Followers')
    const q1 = query(ref1, where('followers', 'array-contains', auth.currentUser.uid), where('uid', '==', userID))
    await getDocs(q1).then(docs => {
      if (docs.size == 1) {
        setFollowed(true)
      } else {
        setFollowed(false)
      }
    })
    const doc1 = doc(db, "User", userID);
    const result = await getDoc(doc1)
    if (result.exists()) {
      const data = result.data()
      setProfileImage(data.profileImage)
      setUserName(data.username)
      setFollowers(data.follower)
      setFollowing(data.following)
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
    return (
      <Item feedImage={item.feedImage} uid={item.uid} id={item.id} fullName={item.fullName} date={item.date} username={item.username} displayName={item.displayName} description={item.description} profileImage={item.profileImage} />
    )
  };
  const Item = ({ uid, id, username, description, profileImage, date, fullName, feedImage }) => {
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
    if (feedImage != null) {
      return (

        <View style={styles.item}>

          <View style={{ paddingHorizontal: 0, display: 'flex', flexDirection: 'column', width: "100%" }}>
            <View style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 10 }}>
              {
                profileImage != null ?
                  <Image source={{ uri: profileImage }} style={styles.feedImage} />
                  :
                  <Image source={require("../../asset/local/Blank.png")} style={[styles.feedImage]} />
              }
              <View style={{ display: 'flex', flexDirection: 'column', paddingLeft: 15 }}>
                <Text style={{ fontSize: 16, color: 'black', fontWeight: '800' }}>{fullName}</Text>
                <Text style={{ fontSize: 12, color: '#404040', marginTop: 5 }}>@{username}</Text>
              </View>

            </View>
            <View>
              {feedImage != null ?
                <Image source={{ uri: feedImage }} style={{ width: "80%", height: 200, resizeMode: 'cover', alignSelf: 'center' }} />
                : <></>
              }
            </View>

          </View>
        </View>
      )
    } else {
      return (

        <View style={[styles.item]}>

          <View style={{ paddingHorizontal: 0, display: 'flex', flexDirection: 'column', width: "100%" }}>
            <View style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 10 }}>
              {
                profileImage != null ?
                  <Image source={{ uri: profileImage }} style={styles.feedImage} />
                  :
                  <Image source={require("../../asset/local/Blank.png")} style={[styles.feedImage]} />
              }
              <View style={{ display: 'flex', flexDirection: 'column', paddingLeft: 15 }}>
                <Text style={{ fontSize: 16, color: 'black', fontWeight: '800' }}>{fullName}</Text>
                <Text style={{ fontSize: 12, color: '#404040', marginTop: 5 }}>@{username}</Text>
              </View>

            </View>
            <View style={{ width: '100%', paddingLeft: 25, paddingRight: 35, paddingTop: 15 }}>
              <Text style={{ textAlign: 'justify', fontSize: 20, color: '#404040' }}>
                {description}
              </Text>
            </View>
           
          </View>
        </View>
      )
    }
  };

  const profileHeader = () => {
    return (
      <View style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: "#fff", }}>
        <View style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>
          <Text style={{ color: '#000', textAlign: 'center', padding: 10, margin: 10, width: "90%", marginRight: 'auto', fontSize: 20, fontWeight: '700', borderBottomColor: '#cfcfcf', borderBottomWidth: 1 }}>@ {username}</Text>
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
    )
  }
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
        {userID != auth.currentUser.uid ?
          <>
            {followed == true ?
              <TouchableOpacity onPress={unfollowUser} style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#fff', borderColor: "#318EF7", borderWidth: 1, padding: 10, paddingHorizontal: 30, borderRadius: 20, position: 'absolute', top: 20, right: 30, zIndex: 100 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#318EF7' }}>
                  Following
                </Text>
              </TouchableOpacity>

              :
              <TouchableOpacity onPress={followUser} style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#318EF7', padding: 10, paddingHorizontal: 30, borderRadius: 20, position: 'absolute', top: 20, right: 30, zIndex: 100 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>
                  Follow
                </Text>
                <Ionicons name="person-add-outline" size={16} onPress={() => { navigation.goBack() }} color="white" style={{ marginLeft: 10 }} />

              </TouchableOpacity>

            }
          </>
          : <></>}
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      </View>



      <SafeAreaView style={{ position: 'relative', top: -250, paddingBottom: 250, backgroundColor: 'white' }}>
        <ActivityIndicator animating={feedDownloading} size="large" color="#000000" style={{ position: 'absolute', bottom: 100, alignSelf: 'center', zIndex: 100 }} />

        <FlatList
          ListHeaderComponent={profileHeader}
          data={DATA}
          numColumns={2}
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
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 20,
    paddingTop: 20,
    width: '50%',
    padding: 4,
    borderColor: "#f6f6f6",
    borderBottomWidth: 1,
    borderRightWidth: 1,
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