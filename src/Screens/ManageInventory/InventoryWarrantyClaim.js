import {FlatList, View, TouchableOpacity, Text} from 'react-native';
import React, {useContext, useEffect} from 'react';
import constants from '../../constants/constants';
import {DataContext} from '../../Context/context-provider';
import JsonServer from '../../Api/api/JsonServer';
import styles from '../../Styles/Style';

const InventoryWarrantyClaim = () => {
    const {
        userCredential,
        getAPICall,
        inventoryWarrantyClaim, 
        setInventoryWarrantyClaim,
        wOScreenNavigationProps
      } = useContext(DataContext);

      useEffect(() => {
          
        var userName = JSON.parse(userCredential).userNameOrEmailAddress;
        var url =
          JsonServer.baseURL +
          'services/app/HNLEmolyeeInventoryQue/GetAllHNLReturnableInventory?username=' +
          userName;
        getAPICall(url, (success, result, error) => {
          if (success == true) {
            if (result.items.length > 0) {
              setInventoryWarrantyClaim(result.items);
            }
          } else {
            dropDownAlertRef.alertWithType('error', 'Alert', error.message);
          }
        });
      }, []);
    
      const handleDetailPress = (item) => {
        wOScreenNavigationProps.navigate("ScanBarcodeForWarrantyClaim", { barcodeItem: item,barCodeStatus: constants.placedAtSite });
      };
    
      const renderItem = (item) => {
        return (
          <TouchableOpacity
            onPress={() => handleDetailPress(item)}
            style={{
              padding: 10,
              borderColor: constants.colorPrimary,
              borderWidth: 1,
              borderRadius: 10,
              margin: 2,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.flatlistItemTextBoldRed}>Site Code</Text>
                  <Text style={[styles.flatlistItemTextBoldRed, {}]}>
                    {item.siteCode}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.flatlistItemTextBoldRed}>Item Id</Text>
                  <Text style={styles.flatlistItemTextBoldRed}>{item.itemId}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      };

  return (
    <View style={{flex: 1}}>
      <FlatList
        style={styles.list}
        data={inventoryWarrantyClaim}
        renderItem={({item}) => renderItem(item)}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}

export default InventoryWarrantyClaim