import React, { useContext, useEffect, useState,useRef,useCallback } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
  Dimensions
} from 'react-native';
import MapView, { Marker ,PROVIDER_GOOGLE} from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions';
import styles from '../../Styles/Style';
import constants from '../../constants/constants';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAcYnbq6Q05INrSgBDw2BLgRNP-jTTSbsU';


const TripsManagementMapsScreen = ({ route, navigation }) => {
  const { width, height } = Dimensions.get("window");

   const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 30,
    padding: 10,
    padding2: 12,

    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 22,
    h3: 20,
    h4: 18,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,
    body5: 12,

    // app dimensions
    width,
    height
};
  const [coordinates, setCoordinates] = useState([]);
  const [isReady, setIsReady] = React.useState(false)
  const mapView = React.useRef()
  useEffect(() => {
    var cooArr = [];
    cooArr.push({
      latitude: parseFloat(route.params.item.latitude),
      longitude: parseFloat(route.params.item.longitude),
    });
    cooArr.push({
      latitude: parseFloat(31.51),
      longitude: parseFloat(74.11),
    });
    setCoordinates(cooArr);
  }, []);


  const handleGetDirections = () => {
    const data = {
      source: {
        //  getting Current Location
      },
      destination: {
        latitude: coordinates[0].latitude,
        longitude: coordinates[0].longitude,
      },
      params: [
        {
          key: 'travelmode',
          value: 'driving', // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: 'dir_action',
          value: 'navigate', // this instantly initializes navigation using the given travel mode
        },
      ],
    };

    getDirections(data);
  };

 const[markers,setMarkers]= useState([{
    title: 'hello',
    coordinates: {
      latitude: 24.86170245,
      longitude: 67.00310938,
    },
  },
  {
    title: 'hello',
    coordinates: {
      latitude: 3.149771,
      longitude: 101.655449
    },  
  }])
 

  return (
    <View style={{ flex: 1 }}>
      <MapView
         provider={PROVIDER_GOOGLE}
        style={{ flex: 1,   width: '100%', height: '100%' }}
        initialRegion={{
          latitude: parseFloat(route.params.item.latitude),
          longitude: parseFloat(route.params.item.longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        ref={mapView}
     
      >
        {markers.map(marker => (
        <Marker 
          coordinate={coordinates[0]}
          title="origin"
          pinColor={constants.colorPrimary}
        />  
      ))}
   
       {markers.map(marker => (
        <Marker 
          coordinate={coordinates[1]}
          title="destiniation"
          pinColor={constants.colorPrimary}
        />
      ))}
        {/* {coordinates && <MapViewDirections
          apikey={GOOGLE_MAPS_APIKEY}
          origin={coordinates[0]}
          destination={coordinates[1]}
          strokeWidth={3}
          strokeColor={constants.colorPrimary}
          optimizeWaypoints={true}
          onStart={(params) => {
            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
          }}
          onReady={result => {
            console.log(`Distance: ${result.distance} km`)
            console.log(`Duration: ${result.duration} min.`)

            if (!isReady) {
              // Fit route into maps
              mapView.current.fitToCoordinates([coordinates[0], coordinates[1]], {
                  edgePadding: {
                      right: (SIZES.width / 20),
                      bottom: (SIZES.height / 4),
                      left: (SIZES.width / 20),
                      top: (SIZES.height / 8)
                  }
              })

         
               setIsReady(true)
          }
          }}
          onError={(errorMessage) => {

          }}
        />
        } */}
      </MapView>
      <TouchableOpacity
        style={styles.LoginButton}
        onPress={() => handleGetDirections()}
      >
        <Text style={styles.buttonTextSmall}>Direction</Text>
      </TouchableOpacity>

    </View>

  )
}
export default TripsManagementMapsScreen;
