import { ActivityIndicator, FlatList, Text, TouchableOpacity, View , StyleSheet } from 'react-native'
import React, { useContext, useRef, useState } from 'react';
import constants from '../../constants/constants'
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';

const Accepted = () => {
    const { getAPICall, wOScreenNavigationProps, GetAllIssuances, setGetAllIssuances } = useContext(DataContext)
    let dropDownAlertRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true)
    const isFocused = useIsFocused();
    useFocusEffect(
        React.useCallback(() => {
            AsyncStorage.getItem("userId").then((value) => {
                GetAllStock(JSON.parse(value))
            })
        }, [isFocused])
    )
    const GetAllStock = (id) => {
        var url = JsonServer.baseURL + "services/app/NonTelcoStoreLedger/GetAllStock?MaxResultCount=100&EmployeeId="+id+"&Availablity=Available"
        getAPICall(url, (success, result, error) => {
            if (success == true) {
                if (result.items.length > 0) {
                    GetAllIssuances(result.items.filter(x => x.workOrderTypeName == "PM"))
                } else {
                    GetAllIssuances([])
                }
                setIsLoading(false)
            }
            else {
                setIsLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }
  return (
      <TouchableOpacity  style={{
          padding: 10,
          borderColor: constants.colorPrimary,
          borderWidth: 1,
          borderRadius: 10,
          margin: 2,
      }} >
          <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                  <Text style={styles.flatlistItemTextBoldRed} >RUR2005</Text>
                  <Text style={styles.flatlistItemTextBoldRed} >PM/NonTelco</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                  <Text style={styles.flatlistItemTextBoldRed} >PM WORK Order Non Telco By new Team</Text>
                  <Text style={styles.flatlistItemTextBoldRed} >2023-03-31 00</Text>
              </View>
          </View>
      </TouchableOpacity>
  )
}

export default Accepted
const styles = StyleSheet.create({
    flatlistItemTextBoldRed: {
        color: constants.colorMainBg,
        fontSize: 14,
        fontWeight: '400',
    },
})