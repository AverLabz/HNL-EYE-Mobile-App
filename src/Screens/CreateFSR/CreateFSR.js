import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from '../../Components/Loader/Loader';
import { DataContext } from '../../Context/context-provider';
import constants from '../../constants/constants';
import ServiceItemScreen from './ServiceItemScreen';
import StoreItemScreen from './StoreItemScreen';
import SubmitFsrScreen from './SubmitFsrScreen';
import JsonServer from '../../Api/api/JsonServer';


const CreateFSR = ({ navigation, route }) => {
    const { vehicleNumber, setVehicleNumber, getAPICall, vehicleMillage, setVehicleMillage, setSelectedWO, setActivityType, fsrNumber, setFsrNumber } = useContext(DataContext);

    const Tab = createMaterialTopTabNavigator();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [fsrSite, setFsrSite] = useState([])

    const [openActivityType, setOpenActivityType] = useState(false)
    const [activityTypeValue, setActivityTypeValue] = useState(null)
    const [activityTypeItems, setActivityTypeItems] = useState([
        { label: 'Service', value: 'Service' },
        { label: 'Visit Only', value: 'Visit Only' }
    ])

    const [openVehicleNumber, setOpenVehicleNumber] = useState(false);
    const [VehicleNumberValue, setVehicleNumberValue] = useState(null);
    const [VehicleNumberItems, setVehicleNumberItems] = useState([]);


    const getAllRegionWideVehicle = () => {
        setIsLoading(true)
        var url = JsonServer.baseURL + "services/app/Vehicle/GetAllRegionWideVehicle"
        getAPICall(url, (success, result, error) => {
            if (success == true) {
                if (result) {

                    let vehicleNumberTempArr = [];
                    result.forEach((itemsElement) => {
                        vehicleNumberTempArr.push({
                            label: itemsElement.vehicleNumber,
                            value: itemsElement.id,
                        });
                    });
                    setVehicleNumberItems(vehicleNumberTempArr)
                    setIsLoading(false)
                }
            }
            else {
                setIsLoading(false)
            }
        })
    }

    useEffect(() => {
        getAllRegionWideVehicle();

    }, [])


    return (
        <View style={{ flex: 1, backgroundColor: constants.lightGrayColor }}>


            {isLoading && <Loader animating={isLoading} />}
            {!isLoading &&
                <View style={styles1.panel}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setModalVisible(true)} style={styles1.panelButton}>
                        <Text style={styles1.panelButtonTitle}>{activityTypeValue == null || vehicleNumber == '' || vehicleMillage == '' ? "Select Activity Type & vehicle #" : fsrSite}</Text>
                    </TouchableOpacity>
                </View>}

            {activityTypeValue != null && VehicleNumberValue != null && vehicleMillage != '' && fsrNumber != '' &&
                <Tab.Navigator
                    screenOptions={{
                        tabBarScrollEnabled: true,
                    }}
                    tabBarOptions={{
                        activeTintColor: constants.colorPrimary,
                        inactiveTintColor: constants.colorPrimary,
                        scrollEnabled: true,
                        indicatorStyle: {
                            backgroundColor: constants.colorPrimary,
                        },
                    }}
                >
                    <Tab.Screen name="StoreItemScreen" component={StoreItemScreen} options={{ tabBarLabel: 'Store Items' }} />
                    <Tab.Screen name="ServiceItemScreen" component={ServiceItemScreen} options={{ tabBarLabel: 'Service Items' }} />
                    <Tab.Screen name="SubmitFsrScreen" component={SubmitFsrScreen} initialParams={route.params.WoDetails} options={{ tabBarLabel: 'Submit' }} />

                </Tab.Navigator>}

            <Modal
                isVisible={isModalVisible}
                swipeDirection='down'
                style={{ margin: 0 }}>

                <SafeAreaView style={styles1.main}>
                    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 10 }}>

                        <View style={{ margin: 10, alignSelf: "flex-end" }}>
                            <TouchableOpacity style={styles1.closeButtonStyle} onPress={() => setModalVisible(false)}>
                                <Text style={{ fontWeight: "700", color: constants.colorWhite }}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles1.filterViewContainer}>
                            <View style={{ width: "80%" }}>
                                <DropDownPicker
                                    open={openActivityType}
                                    value={activityTypeValue}
                                    items={activityTypeItems}
                                    setOpen={setOpenActivityType}
                                    setValue={setActivityTypeValue}
                                    setItems={setActivityTypeItems}
                                    placeholder="Select Activity Type"
                                    style={styles1.DropDownPicker}
                                    onChangeValue={(item) => {
                                        if (item) {
                                            setActivityTypeValue(item)
                                        }
                                    }}
                                    onSelectItem={(item) => {
                                        setSelectedWO(item.value);
                                        setFsrSite(item.label)
                                        setActivityType(item.label)
                                    }}
                                    searchable
                                    listMode="MODAL"
                                />
                            </View>
                            <TouchableOpacity onPress={() => setActivityTypeValue(null)} style={styles1.iconContainer}>
                                <MaterialIcons name="refresh" size={25} color={constants.blackText} />
                            </TouchableOpacity>
                        </View>


                        <View style={styles1.filterViewContainer}>
                            <View style={{ width: "80%" }}>
                                <DropDownPicker
                                    open={openVehicleNumber}
                                    value={VehicleNumberValue}
                                    items={VehicleNumberItems}
                                    setOpen={setOpenVehicleNumber}
                                    setValue={setVehicleNumberValue}
                                    setItems={setVehicleNumberItems}
                                    placeholder="Select Vehicle"
                                    style={styles1.DropDownPicker}
                                    onChangeValue={(item) => {
                                        if (item) {
                                            setVehicleNumberValue(item)
                                        }
                                    }}
                                    onSelectItem={(item) => {
                                        setVehicleNumber(item.value)
                                    }}
                                    searchable
                                    listMode="MODAL"
                                />
                            </View>
                            <TouchableOpacity onPress={() => setVehicleNumberValue(null)} style={styles1.iconContainer}>
                                <MaterialIcons name="refresh" size={25} color={constants.blackText} />
                            </TouchableOpacity>
                        </View>

                        {/* <View style={styles1.filterViewContainer}>
                            <View style={{ width: "100%" }}>
                                <TextInput
                                    style={{ width: "100%", backgroundColor: "white", borderWidth: 0.5, borderColor: constants.colorPrimary, marginTop: 5, borderRadius: 5, paddingLeft: 15 }}
                                    placeholder="Enter Vehicle Number"
                                    onChangeText={(text) => setVehicleNumber(text)}
                                    value={vehicleNumber}
                                />
                            </View>
                        </View> */}
                        <View style={styles1.filterViewContainer}>
                            <View style={{ width: "100%" }}>
                                <TextInput
                                    style={{ width: "100%", backgroundColor: "white", borderWidth: 0.5, borderColor: constants.colorPrimary, marginTop: 5, borderRadius: 5, paddingLeft: 15 }}
                                    placeholder="Enter Current Meter Reading"
                                    onChangeText={(text) => setVehicleMillage(text)}
                                    value={vehicleMillage}
                                    keyboardType='number-pad'
                                />
                            </View>
                        </View>
                        <View style={styles1.filterViewContainer}>
                            <View style={{ width: "100%" }}>
                                <TextInput
                                    style={{ width: "100%", backgroundColor: "white", borderWidth: 0.5, borderColor: constants.colorPrimary, marginTop: 5, borderRadius: 5, paddingLeft: 15 }}
                                    placeholder="Enter HNL FSR Number"
                                    onChangeText={(text) => setFsrNumber(text)}
                                    value={fsrNumber}
                                />
                            </View>
                        </View>



                        <View style={styles1.panel}>
                            <TouchableOpacity disabled={activityTypeValue == null || VehicleNumberValue == null || vehicleMillage == '' || fsrNumber == '' ? true : false} onPress={() => {
                                setModalVisible(false)
                            }}
                                style={{ ...styles1.panelButton, backgroundColor: activityTypeValue == null || VehicleNumberValue == null || vehicleMillage == '' || fsrNumber == '' ? constants.lightGrayColor : constants.colorPrimary }}>
                                <Text style={styles1.panelButtonTitle}>Save</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </SafeAreaView>
            </Modal >
        </View>
    );
};

export default CreateFSR;

const styles1 = StyleSheet.create({
    panelButton: {
        padding: 14,
        borderRadius: 8,
        backgroundColor: constants.colorPrimary,
        alignItems: 'center',
        marginVertical: 7,
    },
    main: {
        backgroundColor: '#fff',
        width: "100%",
        alignSelf: 'center',
        bottom: -20,
        position: 'absolute',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    panelButtonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    panel: {
        paddingHorizontal: 10,
    },
    DropDownPicker: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: 'black',
        width: "100%"
    },
    closeButtonStyle: { backgroundColor: constants.colorPrimary, height: 25, width: 25, borderRadius: 100, alignItems: "center", justifyContent: 'center', },
    row: { flexDirection: 'row', backgroundColor: constants.lightGrayColor, },
    header: { height: 40, backgroundColor: "#C0C0C0" },
    text: { fontSize: 14, textAlign: 'center', color: constants.blackText, },
    btn: { width: 58, backgroundColor: '#78B7BB', borderRadius: 2, alignSelf: "center" },
    btnText: { textAlign: 'center', color: '#fff' },
    loadingContainer: { flex: 1, position: 'absolute', top: '40%', right: 0, left: 0, zIndex: 1 },
    filterViewContainer: { width: "100%", padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", },
    iconContainer: { width: "15%", backgroundColor: constants.lightGrayColor, padding: 5, alignItems: "center", borderRadius: 8 },
});