import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import constants from "../../constants/constants";


const NotificationScreen = ({ navigation }) => {

  

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={constants.colorPrimary}/>

            {/* <Container style={styles.container}>
                <View>
                    <Text style={styles.textfont}>Coming Soon</Text>
                </View>
            </Container> */}
           
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dfe3f1',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

    },
    textfont: {
        marginLeft: 25,
        fontSize: 35,

    },
   
})

export default NotificationScreen
