import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../Api/api/JsonServer';
import Loader from '../../Components/Loader/Loader';
import constants from "../../constants/constants";
import { DataContext } from '../../Context/context-provider';
import styles from '../../Styles/Style';

const InventoryAssigned = ({ navigation }) => {

  const { getAPICall, putRequest, postRequest } = useContext(DataContext)
  let dropDownAlertRef = useRef(null);
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState("")
  const [skipCount, setSkipCount] = useState(0)
  const [assignedInventory, setAssignedInventory] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('userCredential').then((value) => {
        let id = parseInt(JSON.parse(value).userNameOrEmailAddress)
        setUserId(id)
        console.log('id',id)
        getAllIssuance(id, skipCount)
      })
    }, [navigation, skipCount])
  )

  useEffect(() => {
    setSkipCount(0)
  }, [])


  const getAllIssuance = (id, count) => {

    setIsLoading(true)
    // var url = JsonServer.baseURL + "services/app/JazzTelcoInventoryConsumption/GetAll?ERPId=" + id + "&Status=ASSIGNED"
    var url = JsonServer.baseURL + "services/app/JazzTelcoInventoryConsumption/GetAll?MaxResultCount=200&ERPId=" + id + "&Status=ASSIGNED"
    getAPICall(url, (success, result, error) => {
      if (success == true) {
        if (result.items.length > 0) {
          setAssignedInventory(result.items)
          // var arr = assignedInventory;
          // Array.prototype.push.apply(arr, result.items)
          // setAssignedInventory(arr)

          // setTotalCount(result.totalCount)
          // // setAssignedInventory(result.items)
        } 
        // else {
        //   setText("Data Not Found")
        //   var arr = assignedInventory;
        //   Array.prototype.push.apply(arr, result.items)
        //   setAssignedInventory(arr)
        //   setIsLoading(false)
        // }
        setIsLoading(false)
      }
      else {
        setIsLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const handleAcceptItems = (data) => {
    let itemArr = data.filter(x => x.selected == true)
    let getAllIds = itemArr.map(a => a.id)

    let newArr = data.filter((item) => item.selected !== true);
    setAssignedInventory(newArr)

    var url = JsonServer.baseURL + "services/app/JazzTelcoInventoryConsumption/AcceptInventories"

    let dataToInsert = {
      issuanceIds: getAllIds,
    }
    setIsLoading(true)
    postRequest(dataToInsert, url, (success, result, error) => {
      if (success) {
        getAllIssuance(userId, skipCount)
        dropDownAlertRef.alertWithType('success', 'Alert', "Data has been updated")
      } else if (error) {
        setIsLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const onPressHandler = (item) => {

    let renderData = [...assignedInventory];
    for (let data of renderData) {
      if (data.id == item.id) {
        data.selected = (data.selected == null) ? true : !data.selected;
        break;
      }
    }
    setAssignedInventory(renderData);
  }

  const handleFooterComponent = () => {

    return (
      isLoading ? <Loader animating={isLoading} /> : null
    )
  }

  function handleLoadMoreData() {

    console.log("SkipCount ", skipCount)
    if (skipCount <= totalCount) {

      setSkipCount(skipCount + 10)
      setIsLoading(true)
    }

  }


  const renderItem = (item) => {
    return (
      <TouchableOpacity onPress={() => onPressHandler(item)} style={{
        padding: 10,
        borderColor: constants.colorPrimary,
        borderWidth: 1,
        borderRadius: 10,
        margin: 2,
        backgroundColor: item.selected == true ? constants.colorGrey838383 : "transparent"
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
      {assignedInventory.length > 0 ? <FlatList
        style={styles.list}
        data={assignedInventory}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item, index) => index.toString()}
        // ListFooterComponent={handleFooterComponent()}

        // onEndReached={({ distanceFromEnd }) => {
        //   handleLoadMoreData()
        // }}
        onEndReachedThreshold={0.5}
      /> :
        <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>{text}</Text>
        </View>}
      {assignedInventory.filter(x => x.selected == true).length > 0 && <View style={{ alignItems: "center", justifyContent: 'center', bottom: 20 }}>
        <TouchableOpacity disabled={isLoading} style={{ backgroundColor: constants.colorPrimary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} onPress={() => handleAcceptItems(assignedInventory)}>
          <Text style={{ color: constants.colorWhite, fontSize: 16, fontWeight: "600" }}>
            Accept
          </Text>
        </TouchableOpacity>
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
export default InventoryAssigned;
