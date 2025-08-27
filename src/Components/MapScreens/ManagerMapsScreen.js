import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
  useWindowDimensions,
  Alert
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import styles from '../../Styles/Style';
import constants from '../../constants/constants';
import database from '@react-native-firebase/database';
import { DataContext } from '../../Context/context-provider';
// import MapViewDirections from 'react-native-maps-directions';
// import BackgroundGeolocation from "react-native-background-geolocation";
import getDirections from 'react-native-google-maps-directions';


const GOOGLE_MAPS_APIKEY = 'AIzaSyA_ytPiL72XIxxQR0k_iZ81v8Rr5eW9p1Q';


const ManagerMapsScreen = ({ route, navigation }) => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const { userCredential, checkDistance } = useContext(DataContext)

  const [coordinates, setCoordinates] = useState([]);

  const [markers, setMarkers] = useState([])
  const mapRef = useRef(null);
  useEffect(() => {


    var cooArr = [];
    let values = [];
    const ref = database()
      .ref('/users/' + route.params.item.userName + '/CurrentLatLong');
    ref.on('value', snapshot => {
      snapshot.forEach((child) => {
        values.push(child.val());
      });
      if (values.length > 0) {
        cooArr.push({
          latitude: parseFloat(values[values.length - 1].latitude),
          longitude: parseFloat(values[values.length - 1].longitude),
        })
        setCoordinates(cooArr);
        database()
          .ref('/users/' + route.params.item.userName + '/DestinationLatLong')
          .on('value', snapshotChild => {
            var destinationCooArr = [];
            destinationCooArr.push({
              title: 'Current',
              coordinates: {
                latitude: parseFloat(values[values.length - 1].latitude),
                longitude: parseFloat(values[values.length - 1].longitude)
              }
            })

            destinationCooArr.push({
              title: 'Destination',
              coordinates: {
                latitude: parseFloat(snapshotChild.val().latitude),
                longitude: parseFloat(snapshotChild.val().longitude)
              }
            });
            setMarkers(destinationCooArr);
          });
      }
      else {
        Alert.alert("Employee has not started his Trip");
        navigation.goBack();
      }

    })

  }, []);




  return (
    <View style={{ flex: 1 }}>

      {coordinates.length > 0 && markers.length > 1 && <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1, width: '100%', height: '100%' }}
        initialRegion={{
          latitude: parseFloat(coordinates[0].latitude),
          longitude: parseFloat(coordinates[0].longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        ref={mapRef}

      >
        {markers.map(marker => (
          <Marker
            coordinate={marker.coordinates}
            title="origin"
            pinColor={constants.colorPrimary}
          />
        ))}
        {/* <MapViewDirections
          origin={markers[0].coordinates}
          destination={markers[1].coordinates}
          optimizeWaypoints={true}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="hotpink"
          onReady={result => {
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: (windowWidth / 20),
                bottom: (windowHeight / 20),
                left: (windowWidth / 20),
                top: (windowHeight / 20),
              }
            });
          }}
        /> */}
      </MapView>

      }

    </View>

  )
}
export default ManagerMapsScreen;

