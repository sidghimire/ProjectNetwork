import { View, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { tapGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/TapGestureHandler';


const CameraApp = ({ navigation }) => {
  const getPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus()
    const microphonePermission = await Camera.getMicrophonePermissionStatus()
    if (cameraPermission == 'denied' || microphonePermission == 'denied') {
      const requestCameraPermission = await Camera.requestCameraPermission()
      const requestMicrophonePermission = await Camera.requestMicrophonePermission()

    }
  }
  let cameraRef = useRef(null);
  const [clicked, setClicked] = useState(false)
  const [back, setBack] = useState(true)
  const [flash, setFlash] = useState(false)
  const [snapshot, setSnapshot] = useState("")

  useEffect(() => {
    getPermission()
  }, [])
  const devices = useCameraDevices()
  let device = back ? devices.back : devices.front

  const takeSnapshot = async () => {
    const snapshot = await cameraRef.current.takeSnapshot({
      quality: 100,
      skipMetadata: true,
      flash: flash ? 'on' : 'off'
    })
    setClicked(true)
    setSnapshot(snapshot.path)
  }

  if (device == null) {
    return <ActivityIndicator size={20} color={'red'} style={{ alignSelf: 'center', position: 'absolute', top: '50%' }} />;
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        {!clicked ?
          <>
            <Camera
              ref={cameraRef}
              style={{ flex: 1 }}
              device={device}
              isActive={!clicked}
              fps={60}
              photo={true}
              enableZoomGesture={true}
              focusable={true}
              
            />
            <TouchableOpacity onPress={takeSnapshot} style={{ position: 'absolute', bottom: 50, alignSelf: 'center', backgroundColor: '#fff', borderRadius: 50, width: 55 }}>
              <Ionicons name="aperture-outline" size={50} color="black" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ position: 'absolute', top: 20, left: 20, alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 50, }}>
              <Ionicons name="arrow-back-outline" size={25} color="black" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setBack(!back) }} style={{ position: 'absolute', top: 20, right: 20, alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 50, }}>
              <Ionicons name="shuffle-outline" size={25} color="black" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
            </TouchableOpacity>
            {flash ?
              <TouchableOpacity onPress={() => { setFlash(!flash) }} style={{ position: 'absolute', top: 70, right: 20, alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 50, }}>
                <Ionicons name="flashlight-outline" size={25} color="black" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
              </TouchableOpacity> :
              <TouchableOpacity onPress={() => { setFlash(!flash) }} style={{ position: 'absolute', top: 70, right: 20, alignSelf: 'flex-start', backgroundColor: '#000', borderRadius: 50, }}>
                <Ionicons name="flashlight-outline" size={25} color="white" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
              </TouchableOpacity>
            }
          </>
          :
          <>
            <Image source={{ uri: "file://" + snapshot }} style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => { setClicked(false) }} style={{ position: 'absolute', top: 20, left: 20, alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 50, }}>
              <Ionicons name="arrow-back-outline" size={25} color="black" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto' }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('CameraCrop',{uri:"file://" + snapshot})} style={{ backgroundColor: '#007BF7', position: 'absolute', bottom: 20, right: 20, alignSelf: 'flex-start', borderRadius: 50, display: 'flex', flexDirection: 'row', padding: 10, width: 150 }}>
              <Text style={{ fontSize: 20, marginLeft: 20, marginBottom: 'auto', marginTop: 'auto', color: 'white', fontWeight: '600' }}>
                Next
              </Text>
              <Ionicons name="send-outline" size={25} color="white" style={{ padding: 5, alignSelf: 'center', marginLeft: 'auto' }} />
            </TouchableOpacity>
          </>
        }
      </View>
    );
  }
}

export default CameraApp