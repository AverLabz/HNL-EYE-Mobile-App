import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  ImageBackground,
  Text,
  ActivityIndicator,
  View
} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';
import styles from "../../Styles/Style";

const OverTimeCheckoutScreen = ({ navigation }) => {
  const { userCredential, putAPICall } = useContext(DataContext)
  const [loading, setLoading] = useState(false)
  let dropDownAlertRef = useRef(null);
  const markOverTime = () => {
    var url = JsonServer.baseURL + "services/app/Attendance/UserOverTimeCheckOut?UserName=" + JSON.parse(userCredential).userNameOrEmailAddress;
    putAPICall(url, (success, result, error) => {
      setTimeout(() => setLoading(true))
      if (success == true) {
        setTimeout(() => setLoading(false),)
        // Alert.alert("You have ended overtime successfully")
        dropDownAlertRef.alertWithType('success', 'Success', "You have marked overtime successfully")
        // navigation.goBack();
        setTimeout(() => navigation.goBack(), 1200)
      }
      else {
        Alert.alert(error.message)

      }
    })
  }
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <Text style={styles.headerRightTextStyle}>{JSON.parse(userCredential).userNameOrEmailAddress}</Text>
    })
  })
  return (
    <View style={{flex:1}}>

   
    <ImageBackground
      source={require('../../ImageAssets/overtimeBackground.png')}
      style={[styles.mainImageBackgroundSignin, { padding: 20, justifyContent: 'center' }]}>
        
    <DropdownAlert
    ref={(ref) => {
 if (ref) {
   dropDownAlertRef = ref;
 }
}}
closeInterval={500}
showCancel={true}
/>
           <View style={{ position: 'absolute', top: "50%", right: 0, left: 0 }}>
              <ActivityIndicator size="large" animating={loading} color="#511BC5" style={{}} />
          </View>
      {/* <Card style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 15, paddingTop: 10 }}>
        <CardItem>
          <View >
            <View style={{}}>
              <Text style={{ color: constants.colorPrimary, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Do you want to end overtime?</Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <TouchableOpacity onPress={() => { markOverTime() }} style={{ backgroundColor: constants.colorPrimary, marginTop: 20, borderRadius: 5, padding: 5 }}>
                <Text style={styles.buttonTextSmall}>
                  End Overtime
            </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { navigation.navigate("Home") }} style={{ backgroundColor: constants.colorPrimary, marginTop: 5, marginBottom: 30, borderRadius: 5, paddingRight: 15, paddingLeft: 15, padding: 5 }}>
                <Text style={styles.buttonTextSmall}>
                  No Thanks
            </Text>
              </TouchableOpacity>
            </View>
          </View>
        </CardItem>
      </Card> */}


    </ImageBackground>

    </View>
  );
}
export default OverTimeCheckoutScreen;
