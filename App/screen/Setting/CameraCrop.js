import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import { CropView } from 'react-native-image-crop-tools';
import Ionicons from 'react-native-vector-icons/Ionicons';


const CameraCrop = ({ route, navigation }) => {
  const cropViewRef = useRef(null)
  const saveImage = () => {
    cropViewRef.current.saveImage(true, 100)
  }
  const rotateImage=()=>{
    cropViewRef.current.rotateImage(true)
  }
  const { uri } = route.params
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={saveImage} style={{ position: 'absolute', top: 20, right: 20, alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 50, zIndex: 100 }}>
        <Ionicons name="checkmark-outline" size={25} color="black" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={rotateImage} style={{ position: 'absolute', top: 70, right: 20, alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 50, zIndex: 100 }}>
        <Ionicons name="sync-outline" size={25} color="black" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ position: 'absolute', top: 20, left: 20, alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 50,zIndex:100 }}>
        <Ionicons name="arrow-back-outline" size={25} color="black" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
      </TouchableOpacity>
      <CropView
        sourceUrl={uri}
        style={{ flex: 1 }}
        ref={cropViewRef}
        onImageCrop={(res) => navigation.navigate("CameraSubmit", { uri: "file://"+res.uri })}
        keepAspectRatio
        aspectRatio={{ width: 90, height: 160 }}

      />
    </View>
  )
}

export default CameraCrop