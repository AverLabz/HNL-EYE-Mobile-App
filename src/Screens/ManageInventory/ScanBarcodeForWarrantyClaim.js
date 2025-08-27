import React, { useRef, useEffect, useContext } from 'react';

import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';

const ScanBarcodeForWarrantyClaim = ({ route, navigation }) => {
  let dropDownAlertRef = useRef(null);
  const {
    postRequest,
  } = useContext(DataContext);
  const onSuccess = (e) => {

    if (e.data == route.params.barcodeItem.itemBarcode) {

      var dataToInsert = {
        userId: route.params.barcodeItem.userId,
        itemBarcode: route.params.barcodeItem.itemBarcode,
        hnlInventoryStatusId: route.params.barcodeItem.hnlInventoryStatusId,
        workorderId: route.params.barcodeItem.workorderId,
        siteCode: route.params.barcodeItem.siteCode,
        itemId: route.params.barcodeItem.itemId,
        dueDate: route.params.barcodeItem.dueDate,
        workOrderDate: route.params.barcodeItem.workOrderDate,
        warehouseId: route.params.barcodeItem.warehouseId,
        returnable: route.params.barcodeItem.returnable,
        warrantyClaimName: "yes",
      };
      postRequest(
        dataToInsert,
        JsonServer.baseURL + 'services/app/HNLEmolyeeWarrantyInventoryQue/Create',
        (success, result, error) => {
          if (success == true) {
            dropDownAlertRef.alertWithType('success', 'Success', "Warranty Claim is logged successfully");
            setTimeout(() => navigation.goBack(), 1200);
          }
          else {
            dropDownAlertRef.alertWithType('error', 'Alert', error.message);
            setTimeout(() => navigation.goBack(), 1200);
          }
        },
      );
    } else {
      dropDownAlertRef.alertWithType('error', 'Alert', "Barcode mismatched");
      setTimeout(() => navigation.goBack(), 1200);
    }
  };

  useEffect(() => {
    return () => { };
  }, []);

  return (
    <View>
      <QRCodeScanner
        styles={{ flex: 1 }}
        onRead={(e) => onSuccess(e)}
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
export default ScanBarcodeForWarrantyClaim;
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
