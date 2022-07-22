import { View, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { ViroScene, ViroText } from '@viro-community/react-viro'

const BasicCamera = ({ navigation }) => {
    const getPermission = async () => {
        const cameraPermission = await Camera.getCameraPermissionStatus()
        const microphonePermission = await Camera.getMicrophonePermissionStatus()
        if (cameraPermission == 'denied' || microphonePermission == 'denied') {
            const requestCameraPermission = await Camera.requestCameraPermission()
            const requestMicrophonePermission = await Camera.requestMicrophonePermission()

        }
    }
    const getGalleryImage = async () => {
        const result = await launchImageLibrary();
        navigation.navigate('CameraCrop', { uri: result.assets[0].uri })
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
            <ViroScene>
                <ViroText text="Hello World" position={[0, -.1, -1]} />
            </ViroScene>

        );
    }
}

export default BasicCamera