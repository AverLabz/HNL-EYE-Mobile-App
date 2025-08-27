import React, { useContext, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../Api/api/JsonServer';
import { showSuccess, showWarning } from '../../Components/AlertsMessage/AlertMessage';
import Loader from '../../Components/Loader/Loader';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import styles from './styles';

const SubmitFsrScreen = ({ navigation, route }) => {
    const { storeItems, postRequest, serviceItems, fsrNumber,setFsrNumber, setStoreItems, setServiceItems, vehicleNumber, vehicleMillage, 
        setVehicleMillage, setVehicleNumber, activityType, } = useContext(DataContext);
    let dropDownAlertRef = useRef(null);
    const [remarks, setRemarks] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmitFsr = () => {

        let storeItemsData = [];
        let serviceItemData = [];

        storeItems.forEach(element => {
            storeItemsData.push({
                itemId: element.itemCode,
                quantity: element.quantity
            })
        });

        serviceItems.forEach(element => {
            serviceItemData.push({
                itemId: element.itemCode,
                quantity: element.quantity
            })
        });

        let data = route.params;
        setIsLoading(true)

        var url = JsonServer.baseURL + "services/app/FSR/CreateOrUpdate"
        let dataToInsert = {
            hnlFsrNumber: fsrNumber,
            workOrderId: data.id,
            siteId: data.siteId,
            activityType: activityType,
            vehicleNumber: vehicleNumber,
            vehicleMileage: vehicleMillage,
            remarks: remarks,
            storeItems: storeItemsData,
            serviceItems: serviceItemData
        }

        postRequest(dataToInsert, url, (success, result, error) => {
            if (success) {
                showSuccess("Data Uploaded Successfully")
                setTimeout(() => {
                    navigation.pop(1)
                    setIsLoading(false)
                }, 1000);
                setStoreItems([])
                setServiceItems([])
                setVehicleMillage('')
                setVehicleNumber('')
                setFsrNumber('')
            } else if (error) {
                setIsLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: constants.lightGrayColor }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <View style={styles.viewContainer}>
                    <TextInput
                        style={{ backgroundColor: "white", borderWidth: 0.5, borderColor: constants.colorPrimary, marginTop: 5, borderRadius: 5, paddingLeft: 15 }}
                        placeholder="Enter Remarks"
                        onChangeText={(text) => setRemarks(text)}
                        value={remarks}
                    />
                </View>

                {isLoading && <Loader animating={isLoading} />}

                <View style={styles.panel}>
                    <TouchableOpacity activeOpacity={0.7} disabled={isLoading} onPress={() => { handleSubmitFsr() }}
                        style={{ ...styles.panelButton, backgroundColor: constants.colorPrimary }}>
                        <Text style={styles.panelButtonTitle}>Submit FSR</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
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

export default SubmitFsrScreen