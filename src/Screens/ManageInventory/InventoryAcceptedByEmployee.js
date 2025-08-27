import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../Api/api/JsonServer';
import Loader from '../../Components/Loader/Loader';
import constants from "../../constants/constants";
import { DataContext } from '../../Context/context-provider';
import styles from '../../Styles/Style';

const InventoryAcceptedByEmployee = ({ navigation }) => {

  const { getAPICall, wOScreenNavigationProps, acceptedInventory, setAcceptedInventory } = useContext(DataContext)
  let dropDownAlertRef = useRef(null);
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState("")

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('userCredential').then((value) => {
        let id = parseInt(JSON.parse(value).userNameOrEmailAddress)
        setUserId(id)
        getAllIssuance(id)
      })
    }, [navigation])
  )

  const handleDetailPress = (item) => {
    wOScreenNavigationProps.navigate("CaptureImage", { barcodeItem: item, barCodeStatus: constants.placedAtSite, headerTitle: "Assign To Site" })
  }

  const getAllIssuance = (id) => {
    setIsLoading(true)
    var url = JsonServer.baseURL + "services/app/JazzTelcoInventoryConsumption/GetAll?MaxResultCount=100&ERPId=" + id + "&Status=ACCEPTED"
    getAPICall(url, (success, result, error) => {
      if (success == true) {
        if (result.items.length > 0) {
          setAcceptedInventory(result.items)
          setIsLoading(false)
        } else {
          setText("Data Not Found")
          setAcceptedInventory([])
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
      <TouchableOpacity onPress={() => handleDetailPress(item)} style={{
        padding: 10,
        borderColor: constants.colorPrimary,
        borderWidth: 1,
        borderRadius: 10,
        margin: 2,
      }} >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed} >Inventory Name</Text>
              <Text style={[styles.flatlistItemTextBoldRed, {}]} >{item.itemName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed} >Serial Number</Text>
              <Text style={styles.flatlistItemTextBoldRed} >{item.serialNumber}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed} >Returnable</Text>
              <Text style={styles.flatlistItemTextBoldRed} >{item.isReturnable}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed} >Details</Text>
              <Text style={styles.flatlistItemTextBoldRed} >{item.hardwareDetail}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }


  return (
    <View style={{ flex: 1, }} >
      {isLoading && <Loader animating={isLoading} />}
      {acceptedInventory.length > 0 ?
        <FlatList
          style={styles.list}
          data={acceptedInventory}
          renderItem={({ item }) => renderItem(item)}
          onEndReachedThreshold={0.5}
          keyExtractor={item => item.id}
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
    </View>


  );
}
export default InventoryAcceptedByEmployee;
