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
import constants from '../../constants/constants';
import database from '@react-native-firebase/database';
import { DataContext } from '../../Context/context-provider';
// import MapViewDirections from 'react-native-maps-directions';
import JsonServer from '../../Api/api/JsonServer';

const GOOGLE_MAPS_APIKEY = 'AIzaSyA_ytPiL72XIxxQR0k_iZ81v8Rr5eW9p1Q';


const PathMapsScreen = ({ route, navigation }) => {
  const [markers, setMarkers] = useState([])

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const { getAPICall } = useContext(DataContext)

  const [coordinates, setCoordinates] = useState([]);

  const [wayPoints, setWayPoints] = useState([])
  const mapRef = useRef(null);

  useEffect(() => {

    var cooArr = [];
    var destinationCooArr = [];
    
    var url = JsonServer.baseURL + "services/app/TripManagementLocationAllocation/GetAllTripsBytirpId?tripId=" + route.params.tripId;
    getAPICall(url, (success, result, error) => {
      if (success == true) {
        if (result.length > 0) {
          cooArr = result;
          setCoordinates(cooArr);
          var wayPointsArray = [];
          var maxVal = cooArr.length / 10;
          var delta = Math.floor(cooArr.length / maxVal);
          for (i = 0; i < cooArr.length; i = i + delta) {
            wayPointsArray.push(cooArr[i]);
          }
          setWayPoints(wayPointsArray);
          destinationCooArr.push({
            title: 'Current',
            coordinates: {
              latitude: parseFloat(wayPointsArray[0].latitude),
              longitude: parseFloat(wayPointsArray[0].longitude)
            }
          });

          destinationCooArr.push({
            title: 'Destination',
            coordinates: {
              latitude: parseFloat(wayPointsArray[wayPointsArray.length - 1].latitude),
              longitude: parseFloat(wayPointsArray[wayPointsArray.length - 1].longitude)
            }
          });
          setMarkers(destinationCooArr);
        }
      }
    })


  }, [])


  return (
    <View style={{ flex: 1 }}>

      {coordinates.length > 0 && <MapView
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
          origin={wayPoints[0]}
          destination={wayPoints[wayPoints.length - 1]}
          optimizeWaypoints={true}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          waypoints={wayPoints}
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
export default PathMapsScreen;


