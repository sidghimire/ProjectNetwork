import { View, Text, StyleSheet, TextInput } from 'react-native'
import React,{useState} from 'react'
import {collection, getDocs, getFirestore,where,query} from 'firebase/firestore/lite'
import { getAuth } from 'firebase/auth'

const Search = () => {
  const auth=getAuth()
  const db=getFirestore()
  const [searchText,setSearchText]=useState("")
  const getData=async()=>{
    const doc1=collection(db,"user")
    const q1=query(doc1,where('fullname','contains',searchText),where('username','contains',searchText))
    const snapshot=await getDocs(q1)
    snapshot.forEach(doc=>{
      console.log(doc.id)
    })
  }
  const searchUser=()=>{
    getData()
  }
  return (
    <View style={styles.container}>
      <View style={{padding:20}}>
        <TextInput placeholder='Search....' style={styles.searchBar} onChangeText={text=>setSearchText(text)} onTextInput={searchUser}/>
      </View>
    </View>
  )
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  searchBar:{
    padding:10,
    borderColor:'#cdcdcd',
    borderWidth:1,
    borderRadius:10
  }
})

export default Search