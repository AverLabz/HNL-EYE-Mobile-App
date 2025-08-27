import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';
import styles from "../../Styles/Style";
import constants from '../../constants/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const ViewTeamWOs = ({ navigation }) => {
  const { getAPICall } = useContext(
    DataContext,
  );
  //   This UseState Is used For Loader
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    setLoading(true);
    var url =
      JsonServer.baseURL +
      'services/app/WorkOrder/GetAllTeamWorkOrderUsers?MaxResultCount=100000';
    getAPICall(url, (success, result, error) => {
      if (success == true) {
        setLoading(false);
        var Wos = result.items.filter(x => x.status !== "Closed");

      } else {
        setLoading(false);
      }
    });
  }, []);

  return (
    <SafeAreaView edges={['bottom']} style={{flex:1}}>

      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={constants.colorPrimary}
        translucent={false}
      />

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
        )}>
      </FlatList>

    </SafeAreaView>
  );
};
export default ViewTeamWOs;
