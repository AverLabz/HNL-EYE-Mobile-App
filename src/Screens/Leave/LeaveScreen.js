import React, { useContext } from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { DataContext } from '../../Context/context-provider';

const LeaveScreen =({navigation})=> {
  const { getUserData,userInfo ,} = useContext(DataContext)
 
  // const checkinFromHome=()=>{
  //   //
  //   getUserData( (success, result, error) => {
  //     if (success == true) {     
  //       // var data = result.items;
  //       // setState({ data, loading: false }); 
  //       // setFilterdData(data)
  //     }
  //     else { Alert.alert(error.message) }
  //   })
  // }
  
    return (
      <View style={{flex:1}}>
     
          <TouchableOpacity
            onPress={() => navigation.navigate("TaskTickets")}
            style={{justifyContent:'center',alignItems:'center'}}
          >
            <Text style={{fontSize:20}}>Start Duty from Home</Text>
          </TouchableOpacity>
        </View>
     
    );
}
export default LeaveScreen;
