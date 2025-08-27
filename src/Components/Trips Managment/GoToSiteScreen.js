import React, { useRef, useContext, useEffect, useState } from 'react';
import DropdownAlert from 'react-native-dropdownalert';

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  BackHandler,
  Linking,
  ActivityIndicator
} from 'react-native';
import { DataContext } from '../../Context/context-provider';
import styles from '../../Styles/Style';
import constants from '../../constants/constants';
import database from '@react-native-firebase/database';


const GoToSiteScreen = ({ navigation }) => {

  const { getSiteData, getCurretLocation, UserCheckIn, userCredential } = useContext(DataContext)
  const [text, setText] = useState('');
  const [state, setState] = useState({ data: [], loading: false });
  const { data, loading } = state;
  const [filterdData, setFilterdData] = useState([]);
  const [isloading, setIsLoading] = useState(false)

  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');

  let dropDownAlertRef = useRef(null);


  useEffect(() => {
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

      const backAction = () => {
        navigation.goBack()
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );
      return () => backHandler.remove();
    });

    getSiteData((success, result, error) => {
      setTimeout(() => setIsLoading(true),)
      if (success == true) {
        setTimeout(() => setIsLoading(false),)
        var data = result.items;
        setState({ data, loading: false });
        setFilterdData(data)

      }
      else { dropDownAlertRef.alertWithType('error', 'Alert', error.message) }
    })
  }, [])


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
          <ActivityIndicator size="large" animating={isloading} color="#511BC5" style={{}} />
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
              onPress={() => {

                if (item.latitude == null || item.longitude == null)
                  dropDownAlertRef.alertWithType('error', 'Alert', 'Insert Site Location Coordinates')
                else {
                  getCurretLocation((locationData) => {
                    database()
                      .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/speed')
                      .once('value')
                      .then(snapshot => {
                        if (snapshot.val() == null) {
                          database()
                            .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/CurrentLatLong')
                            .push({
                              latitude: locationData.coords.latitude,
                              longitude: locationData.coords.longitude,
                            })
                            .then(() => {


                              database()
                                .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/DestinationLatLong')
                                .set({
                                  latitude: parseFloat(item.latitude),
                                  longitude: parseFloat(item.longitude),
                                })
                                .then(() => {
                                  navigation.navigate("MapsScreen", { latitude: locationData.coords.latitude, longitude: locationData.coords.longitude })
                                });
                            });
                        }
                        else {
                          Alert.alert("Please complete previous trip")
                          getCurretLocation((locationData) => {
                            navigation.navigate("MapsScreen", { latitude: locationData.coords.latitude, longitude: locationData.coords.longitude })

                          })

                        }

                      })

                  });
                }
              }}
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
        showCancel={true}
      />
    </View>
  );
}
export default GoToSiteScreen;
