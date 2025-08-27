import React, { useRef, useContext, useEffect, useState } from 'react';
import DropdownAlert from 'react-native-dropdownalert';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { DataContext } from '../../Context/context-provider';
import styles from '../../Styles/Style';
import constants from '../../constants/constants';
import JsonServer from '../../Api/api/JsonServer';
import ItemDetailComponents from '../../Screens/Calendar/ItemDetailComponents';


const AllTripsScreen = ({ route, navigation }) => {

  const { getAPICall } = useContext(DataContext)
  const [isloading, setIsLoading] = useState(false)
  const [tripsData, setTripsData] = useState([])

  let dropDownAlertRef = useRef(null);


  useEffect(() => {
    
    var url = JsonServer.baseURL + "services/app/TripsManagment/GetAllTripsByErpIdAndDateRange?ErpId=" + route.params.erpId + "&StartDate=" + route.params.date + "&EndDate=" + route.params.date + "&MaxResultCount=1000";
    getAPICall(url, (success, result, error) => {
      if (success == true) {
        setTripsData(result.items)
      }
    })

  }, [])



  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', top: "50%", right: 0, left: 0 }}>
        <ActivityIndicator size="large" animating={isloading} color="#511BC5" style={{}} />
      </View>
      <FlatList
        style={styles.list}
        data={tripsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 10,
              borderColor: constants.colorPrimary,
              borderWidth: 1,
              borderRadius: 10,
              margin: 2,
              marginBottom: 10,
            }}
            onPress={() => {
              
              navigation.navigate("PathMapsScreen", { tripId: item.id })
            }}
          >
            <ItemDetailComponents title="Start Latitude" value={item.startLat} navigation={navigation} ></ItemDetailComponents>
            <ItemDetailComponents title="Start Longitude" value={item.startLon} navigation={navigation} ></ItemDetailComponents>
            <ItemDetailComponents title="End Latitude" value={item.endLat} navigation={navigation} ></ItemDetailComponents>
            <ItemDetailComponents title="End Longitude" value={item.endLon} navigation={navigation} ></ItemDetailComponents>
            <ItemDetailComponents title="Total Distance (meters)" value={parseFloat(item.totalDistance).toFixed(2)} navigation={navigation} ></ItemDetailComponents>
            <ItemDetailComponents title="Travelled Distance (meters)" value={parseFloat(item.actualDistance).toFixed(2)} navigation={navigation} ></ItemDetailComponents>
            <ItemDetailComponents title="Maximum Speed (Km/h)" value={item.maximumSpeed} navigation={navigation} ></ItemDetailComponents>
            <ItemDetailComponents title="Minimum Speed (Km/h)" value={item.minimumSpeed} navigation={navigation} ></ItemDetailComponents>
            <ItemDetailComponents title="Average Speed (Km/h)" value={item.averageSpeed} navigation={navigation} ></ItemDetailComponents>
          </TouchableOpacity>
        )}
      />
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
export default AllTripsScreen;
