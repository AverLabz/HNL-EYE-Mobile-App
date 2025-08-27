import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useRef, useState } from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../Api/api/JsonServer';
import Loader from '../../Components/Loader/Loader';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import styles from '../../Styles/Style';

const InventoryReturnToWarehouse = ({ navigation }) => {
  const {
    getAPICall,

  } = useContext(DataContext);

  let dropDownAlertRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false)
  const [inventoryReturnToWH, setInventoryReturnToWH] = useState([])
  const [text, setText] = useState("")

  useFocusEffect(
    React.useCallback(() => {
      setText("")

      AsyncStorage.getItem('userCredential').then((value) => {
        let id = parseInt(JSON.parse(value).userNameOrEmailAddress)
        setInventoryReturnToWH([])
        getAllIssuance(id)
        console.log('id',id)
      })
    }, [navigation])
  )

  const getAllIssuance = (id) => {
    setIsLoading(true)
    var url = JsonServer.baseURL + "services/app/JazzTelcoInventoryReturn/GetAll?MaxResultCount=100&ERPId=" + id +"&Status=ASSIGNED"
    getAPICall(url, (success, result, error) => {
      if (success == true) {
        let ArrData = []
        if (result.items.length > 0) {

          result.items.forEach(element => {
            
            ArrData.push({
              id: element.id,
              serialNumber: element.serialNumber,
              itemName: element.itemName,
              siteCode: element.siteCode ? element.siteCode : "",
              remarks: element.remarks ? element.remarks : "",
              imagePath: element.imagePath,
            })

          });
          setInventoryReturnToWH(ArrData)
          setIsLoading(false)
        } else {
          setText("Data Not Found")
          setInventoryReturnToWH(ArrData)
          setIsLoading(false)
        }
      }
      else {
        setIsLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          padding: 10,
          borderColor: constants.colorPrimary,
          borderWidth: 1,
          borderRadius: 10,
          margin: 5,
          alignItems: "center",
          backgroundColor: item.selected == true ? constants.colorGrey838383 : "transparent"
        }}>
        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed}>Serial Number</Text>
              <Text style={[styles.flatlistItemTextBoldRed, {}]}>
                {item.serialNumber}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed}>Item Name</Text>
              <Text style={[styles.flatlistItemTextBoldRed, {}]}>
                {item.itemName}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed}>Site Code</Text>
              <Text style={styles.flatlistItemTextBoldRed}>{item.siteCode}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed}>Remarks</Text>
              <Text style={[styles.flatlistItemTextBoldRed, {}]}>
                {item.remarks}
              </Text>
            </View>

          </View>
        </View>
        <Image
          style={{
            height: 150,
            width: "100%",
            backgroundColor: constants.colorGrey838383,
            borderWidth: 1
          }}
          resizeMode="stretch"

          source={{
            uri: JsonServer.imageApiUrl + item.imagePath
          }}
          key={item.id}

        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading && <Loader animating={isLoading} />}
      {!isLoading && inventoryReturnToWH.length > 0 ?
        <FlatList
          style={styles.list}
          data={inventoryReturnToWH}
          renderItem={({ item }) => renderItem(item)}
          onEndReachedThreshold={0.5}
          keyExtractor={(item) => item.id}
        /> :
        <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>{text}</Text>
        </View>}
      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
        showCancel={true}
      />
    </SafeAreaView>
  )
}

export default InventoryReturnToWarehouse