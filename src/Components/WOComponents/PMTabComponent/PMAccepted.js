import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useContext, useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../../Api/api/JsonServer';
import constants from "../../../constants/constants";
import { DataContext } from '../../../Context/context-provider';
import styles from './Style';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomLoader from '../../CustomLoader/CustomLoader';
import WOSearchInput from '../../WOSearchInput';


const PMAccepted = () => {

  const { getAPICall, wOScreenNavigationProps, acceptedWoPM, setAcceptedWoPM } = useContext(DataContext)
  let dropDownAlertRef = useRef(null);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true)
  const [searchedText, setSearchedText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isTelco, setIsTelco] = useState(null)

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("userId").then((value) => {
        getAllAcceptedWorkOrderPM(JSON.parse(value))
      })
    }, [isFocused])
  )

  const getAllAcceptedWorkOrderPM = (id) => {

    var url = JsonServer.baseURL + "services/app/WorkOrder/GetAll?MaxResultCount=1000&AssignedEmployeeId=" + id + "&Status=ACCEPTED";
    getAPICall(url, (success, result, error) => {
      if (success == true) {
        if (result.items.length > 0) {
          setAcceptedWoPM(result.items.filter(x => x.workOrderTypeName == "PM"))
          setFilteredData(result.items.filter(x => x.workOrderTypeName == "PM"))
        } else {
          setAcceptedWoPM([])
          setFilteredData([])
        }
        setIsLoading(false)
      }
      else {
        setIsLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const handleDetailPress = (item) => {
    wOScreenNavigationProps.navigate("PMAcceptedWODetailPage", { acceptedWosItem: item });
  }

  const handleFilteredData = async (text, Telco) => {
    const filter =
      text !== '' // based on text, filter data and use filtered data
        ? filteredData.filter((item) => {
          const itemData = item.siteCode.toUpperCase();
          const textData = text.toUpperCase();
          // Filter based on site code
          const siteCodeMatches = itemData.indexOf(textData) > -1;
          // Filter based on sourceFieldTypeName if isTelco is true
          const isTelcoMatches = Telco ? item.sourceFieldTypeName === "Telco" : item.sourceFieldTypeName === "Non Telco";
          return siteCodeMatches && isTelcoMatches;
        })
        : Telco // If text is empty, return only based on isTelco
          ? filteredData.filter((item) => item.sourceFieldTypeName === "Telco")
          : filteredData.filter((item) => item.sourceFieldTypeName === "Non Telco");
    setAcceptedWoPM(filter);
  };

  const renderItem = (item) => {

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => handleDetailPress(item)} style={styles.renderItemContainer} >
        <View style={styles.renderItemSubContainer}>
          <View style={{ gap: 5 }}>
            <Text style={styles.cardTopRowText} >{item.siteCode}</Text>
            <Text style={[styles.cardTopRowText, { color: constants.red }]} >{item.workOrderTypeName}/{item.sourceFieldTypeName}</Text>
          </View>
          <View style={{ gap: 5 }}>
            <Text style={styles.cardTopRowText} >{item.workOrderDescription}</Text>
            <Text style={[styles.cardTopRowText, { color: constants.red }]} >{item.dueDate}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }


  return (
    <SafeAreaView style={styles.container} >
      <WOSearchInput
        value={searchedText}
        onChangeText={(newText) => {
          setSearchedText(newText);
          handleFilteredData(newText, isTelco);
        }}
        onSubmitEditing={() => { }}
        IsTelco={isTelco}
        onTelcoPress={() => {
          setIsTelco(true)
          handleFilteredData(searchedText, true);
        }}
        onNonTelcoPress={() => {
          setIsTelco(false)
          handleFilteredData(searchedText, false);
        }}
      />
      {isLoading ? <CustomLoader medium /> :
        <FlatList
          data={acceptedWoPM}
          renderItem={({ item }) => renderItem(item)}
          onEndReachedThreshold={0.5}
          keyExtractor={item => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
        />}

      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
        showCancel={true}
      />
    </SafeAreaView>
  );
}
export default PMAccepted;
