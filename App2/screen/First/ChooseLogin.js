import { StyleSheet, Text, View,StatusBar,TouchableOpacity } from 'react-native'
import React from 'react'

const ChooseLogin = ({navigation}) => {
    return (
        <View style={styles.container}>
            <StatusBar/>
            <Text>ChooseLogin</Text>
            <TouchableOpacity onPress={()=>navigation.navigate("Signin")} style={{ padding: 20, backgroundColor: "#dfdfdf" ,margin:10}}><Text style={{ fontSize: 30 }}>Login</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate("Signup")} style={{ padding: 20, backgroundColor: "#dfdfdf" }}><Text style={{ fontSize: 30 }}>Signup</Text></TouchableOpacity>

        </View>
    )
}

export default ChooseLogin

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})