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
import JsonServer from '../../Api/api/JsonServer';

const GOOGLE_MAPS_APIKEY = 'AIzaSyA_ytPiL72XIxxQR0k_iZ81v8Rr5eW9p1Q';


const MapsScreen = ({ route, navigation }) => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const { userCredential, checkDistance, postRequest, getAPICall, getCurretLocation, putRequest } = useContext(DataContext)

  const [coordinates, setCoordinates] = useState([]);
  const [destinationCoordinates, setDestinationCoordinates] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const [markers, setMarkers] = useState([])
  const mapRef = useRef(null);
  useEffect(() => {
    var cooArr = [];
    var destinationCooArr = [];
    database()
      .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/CurrentLatLong')
      .once('value')
      .then(snapshot => {
        snapshot.forEach((child) => {
          cooArr.push(child.val());
        });
        setCoordinates(cooArr);
        database()
          .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/DestinationLatLong')
          .once('value')
          .then(snapshotChild => {

            destinationCooArr.push({
              title: 'Current',
              coordinates: {
                latitude: cooArr[cooArr.length - 1].latitude,
                longitude: cooArr[cooArr.length - 1].longitude
              }
            });

            destinationCooArr.push({
              title: 'Destination',
              coordinates: {
                latitude: parseFloat(snapshotChild.val().latitude),
                longitude: parseFloat(snapshotChild.val().longitude)
              }
            });
            setDestinationCoordinates(destinationCooArr[1])
            setMarkers(destinationCooArr);
          });
      });

  }, []);

  const handleGoToMap = () => {
    const data = {
      source: {
        //  getting Current Location
      },
      destination: {
        latitude: parseFloat(
          destinationCoordinates.coordinates.latitude,
        ),
        longitude: parseFloat(
          destinationCoordinates.coordinates.longitude
        ),
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
  }

  const startTripHandle = () => {
    var cooArr = [];
    var destinationCooArr = [];
    var startLat = "";
    var startLon = "";
    var startDate = "";
    var endLat = "";
    var endLon = "";
    var endDate = "";

    database()
      .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/CurrentLatLong')
      .once('value')
      .then(snapshot => {
        snapshot.forEach((child) => {
          cooArr.push(child.val());
          startLat = cooArr[0].latitude;
          startLon = cooArr[0].longitude;
          startDate = new Date();
          endLat = ""
          endLon = ""
          endDate = ""
        });
        var distance = checkDistance(cooArr[0].latitude, cooArr[0].longitude, destinationCoordinates.coordinates.latitude, destinationCoordinates.coordinates.longitude, "M");

        var dataToInsert = {
          userId: 0,
          startLat: startLat + '',
          startLon: startLon + '',
          startDate: startDate,
          endLat: "",
          endLon: "",
          endDate: new Date(),
          totalTime: "",
          actualTime: "",
          averageSpeed: "",
          minimumSpeed: "",
          maximumSpeed: "",
          totalDistance: distance + '',
          actualDistance: "",
          id: 0
        }

        postRequest(dataToInsert, JsonServer.baseURL + "services/app/TripsManagment/Create", (success, result, error) => {
          
          database()
            .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/DbId')
            .set({
              Id: result.id,
            })
            .then(() => {
            });
        })

      });

  }
  const endTripHandle = () => {
    
    // var speed = [];
    // database()
    //   .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/speed')
    //   .once('value')
    //   .then(snapshot => {
    //     if (snapshot.val()) {
    //       database()
    //         .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/DistanceTravelled')
    //         .once('value')
    //         .then(snapshotChild => {
    //           database()
    //             .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/DbId')
    //             .once('value')
    //             .then(snapshotChildDbId => {
    //               snapshot.forEach((child) => {
    //                 speed.push(parseFloat(child.val().speed) * 3.6);
    //               });
    //               speed.push(6);
    //               const speedToMakeDb = speed.filter(item => item > 5)
    //               var minimumSpeed = 5;
    //               var maximumSpeed = Math.max.apply(null, speedToMakeDb);
    //               var sum = 0;
    //               for (var i = 0; i < speedToMakeDb.length; i++) {
    //                 sum += parseInt(speedToMakeDb[i], 10);
    //               }
    //               var avgSpeed = sum / speedToMakeDb.length;
    //               BackgroundGeolocation.stopWatchPosition();


    //               var dbId = snapshotChildDbId.val().Id

    //               var url = JsonServer.baseURL + "services/app/TripsManagment/Get?Id=" + dbId
    //               getAPICall(url, (success, result, error) => {

    //                 if (success == true) {
    //                   getCurretLocation((locationData) => {
    //                     var distance = checkDistance(result.startLat, result.startLon, locationData.coords.latitude, locationData.coords.longitude)
    //                     var dataToInsert = {
    //                       userId: result.userId,
    //                       startLat: result.startLat,
    //                       startLon: result.startLon,
    //                       startDate: result.startDate,
    //                       endLat: locationData.coords.latitude,
    //                       endLon: locationData.coords.longitude,
    //                       endDate: new Date(),
    //                       totalTime: "",
    //                       actualTime: "",
    //                       averageSpeed: avgSpeed + "",
    //                       minimumSpeed: minimumSpeed + "",
    //                       maximumSpeed: maximumSpeed + "",
    //                       totalDistance: result.totalDistance,
    //                       actualDistance: distance + '',
    //                       id: result.id
    //                     }
    //                     putRequest(dataToInsert, JsonServer.baseURL + "services/app/TripsManagment/Update", () => {
    //                       database()
    //                         .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/CurrentLatLong')
    //                         .once('value')
    //                         .then(snapshotCurrentLatLong => {
    //                           var bulkTripManagmentArr = [];
    //                           snapshotCurrentLatLong.forEach((child) => {
    //                             bulkTripManagmentArr.push({
    //                               tripId: dbId,
    //                               latitude: child.val().latitude + '',
    //                               longitude: child.val().longitude + '',
    //                               id: 0
    //                             })
    //                           });

    //                           var dataToInsert = {
    //                             createBulkTripManagementLocationAllocation: bulkTripManagmentArr
    //                           }
    //                           postRequest(dataToInsert, JsonServer.baseURL + "services/app/TripManagementLocationAllocation/CreateTripManagementLocationAllocationBulk", (success, result, error) => {

    //                             database().ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress).remove();
    //                             BackgroundGeolocation.stopWatchPosition();
    //                             navigation.goBack();
    //                           })

    //                         })

    //                     })
    //                   })

    //                 }
    //                 else {
    //                   Alert.alert(error.message)
    //                 }
    //               })
    //             });
    //         });

    //     }
    //     else {
    //       navigation.goBack()
    //     }
    //   });
  }

  const TrackLocation = async () => {
    handleGoToMap();
    startTripHandle();
    // BackgroundGeolocation.ready(
    //   {
    //     locationAuthorizationRequest: 'Always',
    //     disableLocationAuthorizationAlert: true,
    //     desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    //     stopTimeout: 10,
    //     debug: false,
    //     logLevel: BackgroundGeolocation.LOG_LEVEL_ERROR,
    //     stopOnTerminate: false,
    //     startOnBoot: true,
    //     autoSync: false,
    //     enableHeadless: true,
    //     motionTriggerDelay: 1000,
    //     preventSuspend: true,
    //   }, (state) => {
    //     BackgroundGeolocation.watchPosition((location) => {
    //       BackgroundGeolocation.getOdometer(function (distance) {
    //         database()
    //           .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/DistanceTravelled')
    //           .set({
    //             Distance: distance,
    //           })
    //           .then(() => {
    //           });

    //       });
    //       var distance = checkDistance(location.coords.latitude, location.coords.longitude, destinationCoordinates.coordinates.latitude, destinationCoordinates.coordinates.longitude, "M");
    //       if (distance < 200) {
    //         // endTripHandle()
    //       }
    //       else {
    //         database()
    //           .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/speed')
    //           .push({
    //             speed: location.coords.speed,
    //           })
    //           .then(() => {

    //           });
    //         database()
    //           .ref('/users/' + JSON.parse(userCredential).userNameOrEmailAddress + '/CurrentLatLong')
    //           .push({
    //             latitude: location.coords.latitude,
    //             longitude: location.coords.longitude,
    //           })
    //           .then(() => {
    //           });
    //       }


    //     }, (errorCode) => {
    //     }, {
    //       interval: 10000,
    //       desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    //       persist: true,
    //       extras: { foo: "bar" },
    //       timeout: 60000
    //     })
    //   });
  }


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
            setDistance(result.distance);
            setDuration(result.duration);

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
      <TouchableOpacity onPress={() => { TrackLocation() }} style={[styles.LoginButton, {}]}>
        {/* <Text style={[styles.buttonTextSmall, { marginRight: 20, marginLeft: 10 }]}>{parseFloat(distance).toFixed(2)}km</Text> */}
        <Text style={styles.buttonTextSmall}>Go To Site</Text>
        {/* <Text style={[styles.buttonTextSmall, { marginLeft: 20 }]}>{duration}</Text> */}

      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        endTripHandle()
      }} style={[styles.LoginButton, {}]}>
        <Text style={styles.buttonTextSmall}>End Trip</Text>
      </TouchableOpacity>

    </View>

  )
}
export default MapsScreen;

