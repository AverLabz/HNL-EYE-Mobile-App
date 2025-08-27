import React, { useContext, useEffect, useRef, useState } from 'react';
import DropdownAlert from 'react-native-dropdownalert';

import {
  Alert,
  FlatList,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { DataContext } from '../../../Context/context-provider';
import styles from '../../../Styles/Style';
import constants from '../../../constants/constants';
const ManagerLocationForStartDuty = ({ route, navigation }) => {

  const { getSiteData, getCurretLocation, getCheckInData,
    userCredential, setUserCheckIn, setStartDutyTime } = useContext(DataContext)
  const [text, setText] = useState('');
  const [state, setState] = useState({ data: [], });
  const { data, } = state;
  const [filterdData, setFilterdData] = useState([]);

  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [loading, setLoading] = useState(false)

  let dropDownAlertRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <Text style={styles.headerRightTextStyle}>{JSON.parse(userCredential).userNameOrEmailAddress}</Text>
    })
    getCurretLocation((location, success) => {
      if (success) {
        setCurrentLatitude(location.coords.latitude);
        setCurrentLongitude(location.coords.longitude);
      }
      else {
        Alert.alert(
          "Please turn on your location",
          "Allow HNL to access Your current location",
          [
            {
              text: "Cancel",
              onPress: () => navigation.goBack(),
              style: "cancel"
            },
            { text: "OK", onPress: () => Linking.openSettings() }
          ]
        );
      }
    });
    getSiteData((success, result, error) => {
      setTimeout(() => setLoading(true), 500)
      if (success == true) {
        var data = result.items;
        setState({ data, });
        setFilterdData(data)
        setTimeout(() => setLoading(false), 500)
      }
      else { dropDownAlertRef.alertWithType('error', 'Alert', error.message) }
    })
  }, [])


  const _onClose = () => {
    navigation.navigate('Home')
  };

  const MarkAttandance = (siteCode) => {
    markLocationsWithOutGeoFencing(siteCode);
  }


  const markLocationsWithOutGeoFencing = (siteCode) => {
    var dataToInsert = {
      userId: route.params.item.id,
      userName: route.params.item.userName,
      startlong: currentLongitude,
      endlong: "",
      startLat: currentLatitude,
      endLat: "",
      checkInTime: new Date(),
      checkInFrom: siteCode,
      checkOutFrom: "",
      comments: "",
      status: "Pending",
      id: 0,
    };
    getCheckInData(dataToInsert, (success, result, error) => {
      if (success == true) {
        setUserCheckIn(JSON.stringify(result));
        setStartDutyTime(result.checkInTime)
        navigation.navigate('Success')
      }
      else {
        Alert.alert(error.message)
      }
    })
  }

  const setFilteredData = (text) => {
    var filter = text // based on text, filter data and use filtered data
      ? data.filter(item => {
        const itemData = item.siteCode.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      })
      : data; // on on text, u can return all data
    setFilterdData(filter);
  }
  return (

    <View style={{ flex: 1 }}>
      <View style={styles.pageContainer}>
        <View style={styles.searchInputs}>
          <TextInput
            style={styles.search}
            placeholder={
              'Search Sites'
            }
            onChangeText={text => {
              setText(text)
              setFilteredData(text)
            }}
            value={text}
          />
        </View>
        <View style={{ position: 'absolute', top: "50%", right: 0, left: 0 }}>
          <ActivityIndicator size="large" animating={loading} color="#511BC5" style={{}} />
        </View>
        <FlatList
          style={styles.list}
          data={filterdData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 10,
                borderColor: constants.colorPrimary,
                borderWidth: 1,
                borderRadius: 10,
                margin: 2,
              }}
              onPress={() => MarkAttandance(item.siteCode)}
            >
              <Text >{item.siteCode}</Text>
              <Text >{item.siteName}</Text>
            </TouchableOpacity>
          )}
        />

      </View>

      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
        onClose={_onClose}
        showCancel={true}
      />

    </View>
  );
}
export default ManagerLocationForStartDuty;
