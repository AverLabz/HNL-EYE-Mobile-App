import React, {useRef, useEffect, useContext} from 'react';

import {View,StyleSheet, Text, TouchableOpacity} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import DropdownAlert from 'react-native-dropdownalert';
import constants from '../../constants/constants';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';

const ScanBarcode = ({route, navigation}) => {
  let dropDownAlertRef = useRef(null);
  const {
    putRequest,
  } = useContext(DataContext);
  const onSuccess = (e) => {
    if (e.data == route.params.barcodeItem.itemBarcode) {
        var barcodeParamsData=route.params.barcodeItem;
        var dataToInsert = {
        hnlInventoryStatus: route.params.barCodeStatus,
        siteCode: barcodeParamsData.siteCode,
        dueDate: barcodeParamsData.dueDate,
        workOrderDate: barcodeParamsData.workOrderDate,
        warehouseId: barcodeParamsData.warehouseId,
        id: barcodeParamsData.id
    };
          putRequest(
            dataToInsert,
            JsonServer.baseURL + 'services/app/HNLInventoryQue/UpdateInventoryStatus',
            (success,result,error) => {
                if (success == true) {
                    dropDownAlertRef.alertWithType('success', 'Success', "You have successfully accepted item");
                    setTimeout(() => navigation.goBack(), 1200);
                  }
                  else { dropDownAlertRef.alertWithType('error', 'Alert', error.message) ;
                  setTimeout(() => navigation.goBack(), 1200)

                }
            },
          );
    } else {
      dropDownAlertRef.alertWithType('error', 'Alert', "Barcode mismatched");
      setTimeout(() => navigation.goBack(), 1200);
    }
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <View>
      <QRCodeScanner
       styles={{flex:1}}
        onRead={(e) => {
          onSuccess(e)
        }}
        flashMode={RNCamera.Constants.FlashMode.off}
        
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
};
export default ScanBarcode;
const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
