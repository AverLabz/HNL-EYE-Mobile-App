import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, TextInput } from 'react-native';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownAlert from 'react-native-dropdownalert';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import JsonServer from '../../Api/api/JsonServer';
import Loader from '../../Components/Loader/Loader';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import styles from '../../Styles/Style';

const AddItemsScreen = ({ navigation, route }) => {
    const { getAPICall, storeItems, setStoreItems, serviceItems, setServiceItems } = useContext(DataContext);

    let dropDownAlertRef = useRef(null);
    // const [userId, setUserId] = useState("")
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [allData, setAllData] = useState("")
    const [selectedData, setSelectedData] = useState({})
    const [isEnabled, setIsEnabled] = useState(false);
    const [isClaimEnabled, setIsClaimEnabled] = useState('');
    const [isReturnAble, setIsReturnAble] = useState('')

    const [openItemCode, setOpenItemCode] = useState(false)
    const [itemCodeValue, setItemCodeValue] = useState(null)
    const [itemCodeItems, setItemCodeItems] = useState([])

    const [descriptionValue, setDescriptionValue] = useState('')

    const [barCode, setBarCode] = useState("")
    const [quantity, setQuantity] = useState("")

    useEffect(() => {
        if (route.params.status == "serviceItem") {
            getAllServiceItems()
        } else {
            getAllStoreItems()
        }
    }, [])


    const getAllServiceItems = () => {
        var url = JsonServer.baseURL + "services/app/FSRItem/GetAll?CategoryType=Service&IsDropdown=true"
        getAPICall(url, (success, result, error) => {
            if (success == true) {

                let siteItemsArr = result.items.map(itemsElement => ({
                    label: itemsElement.name,
                    value: itemsElement.id,
                }));
                setItemCodeItems(siteItemsArr);
                setAllData(result.items)
                setIsLoading(false)
            }
            else {
                setIsLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const getAllStoreItems = () => {
        var url = JsonServer.baseURL + "services/app/FSRItem/GetAll?CategoryType=Store&IsDropdown=true"
        getAPICall(url, (success, result, error) => {
            if (success == true) {
                let siteItemsArr = result.items.map(itemsElement => ({
                    label: itemsElement.name,
                    value: itemsElement.id,
                }));
                setItemCodeItems(siteItemsArr);
                setAllData(result.items)
                setIsLoading(false)
            }
            else {
                setIsLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const addStoreItems = (itemName, itemDescription, itemBarcode, itemQuantity, itemReturnable, itemClaimable) => {
        let data = {
            itemCode: itemName,
            description: itemDescription,
            barcode: itemBarcode,
            quantity: itemQuantity,
            isReturnable: itemReturnable,
            isClaimable: itemClaimable
        }
        setStoreItems(storeItems => [...storeItems, data])
        console.log("store Items=== ", storeItems)
        navigation.pop()
    }
    const addServiceItems = (itemName, itemDescription, itemQuantity, itemClaimable) => {
        let data = {
            itemCode: itemName,
            description: itemDescription,
            quantity: itemQuantity,
            claimable: itemClaimable,
        }
        setServiceItems(serviceItems => [...serviceItems, data])
        console.log("data=== ", data)
        navigation.goBack()
    }

    const filterData = (id) => {
        const renderData = allData.filter(function (item) {
            return item.id === id
        })

        setSelectedData(renderData);
        setDescriptionValue(renderData[0].itemDescription)
        setIsClaimEnabled(renderData[0].isClaimable.toString())
        setBarCode(renderData[0].barcode)
        setIsReturnAble(renderData[0].isReturnable.toString())
    }
    return (
        <SafeAreaView style={styles1.main}>
            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 10 }}>

                {!isLoading?<View style={styles1.filterViewContainer}>
                    <View style={{ width: "80%" }}>
                        <DropDownPicker
                            open={openItemCode}
                            value={itemCodeValue}
                            items={itemCodeItems}
                            setOpen={setOpenItemCode}
                            setValue={setItemCodeValue}
                            setItems={setItemCodeItems}
                            placeholder="Select Item"
                            style={styles1.DropDownPicker}
                            onChangeValue={(item) => {

                                if (item) {
                                    setItemCodeValue(item)
                                }
                            }}
                            onSelectItem={(item) => {
                                filterData(item.value)
                            }}

                            searchable
                            listMode="MODAL"
                        />
                    </View>
                    
                    <TouchableOpacity onPress={() => setItemCodeValue(null)} style={styles1.iconContainer}>
                        <MaterialIcons name="refresh" size={25} color={constants.blackText} />
                    </TouchableOpacity>
                </View>:
                <View style={{ position: 'absolute', top: "50%", right: 0, left: 0, zIndex: 1 }}>
                <ActivityIndicator size="large" animating={isLoading} color={constants.colorPrimary} style={{}} />
            </View>}

                <View style={styles1.filterViewContainer}>
                    <TextInput
                        style={{ width: "100%", backgroundColor: "white", borderWidth: 0.5, borderColor: constants.colorPrimary, marginTop: 5, borderRadius: 5, paddingLeft: 15 }}
                        placeholder="Enter Quantity"
                        onChangeText={(text) => setQuantity(text)}
                        value={quantity}
                        keyboardType="numeric"
                    />
                </View>

                {selectedData.length > 0 && <>
                    <View style={[styles1.filterViewContainer, { justifyContent: 'space-between' }]}>
                        <Text style={{ color: constants.blackText, fontSize: 16 }}>Item Description</Text>
                        <Text style={{ color: constants.blackText, fontSize: 16 }}>{descriptionValue}</Text>
                    </View>
                    <View style={[styles1.filterViewContainer, { justifyContent: 'space-between' }]}>
                        <Text style={{ color: constants.blackText, fontSize: 16 }}>Is Returnable</Text>
                        <Text style={{ color: constants.blackText, fontSize: 16 }}>{isReturnAble}</Text>
                    </View>
                    <View style={[styles1.filterViewContainer, { justifyContent: 'space-between' }]}>
                        <Text style={{ color: constants.blackText, fontSize: 16 }}>Is Claimable</Text>
                        <Text style={{ color: constants.blackText, fontSize: 16 }}>{isClaimEnabled}</Text>
                    </View>
                    <View style={[styles1.filterViewContainer, { justifyContent: 'space-between' }]}>
                        <Text style={{ color: constants.blackText, fontSize: 16 }}>Barcode</Text>
                        <Text style={{ color: constants.blackText, fontSize: 16 }}>{barCode}</Text>
                    </View>
                </>}

                {route.params.status == "storeItem" &&
                    <View style={styles1.panel}>
                        <TouchableOpacity disabled={itemCodeValue == null || quantity == "" ? true : false} onPress={() => addStoreItems(itemCodeValue, descriptionValue, barCode, quantity, isEnabled, isClaimEnabled)}
                            style={{ ...styles1.panelButton, backgroundColor: itemCodeValue == null || quantity == "" ? constants.darkGrayColor : constants.colorPrimary }}>
                            <Text style={styles1.panelButtonTitle}>Add</Text>
                        </TouchableOpacity>
                    </View>}

                {route.params.status == "serviceItem" &&
                    <View style={styles1.panel}>
                        <TouchableOpacity disabled={itemCodeValue == null || quantity == "" ? true : false} onPress={() => addServiceItems(itemCodeValue, descriptionValue, quantity, isClaimEnabled)}
                            style={{ ...styles1.panelButton, backgroundColor: itemCodeValue == null || quantity == "" ? constants.darkGrayColor : constants.colorPrimary }}>
                            <Text style={styles1.panelButtonTitle}>Add</Text>
                        </TouchableOpacity>
                    </View>}

            </ScrollView>
        </SafeAreaView>
    )
}

export default AddItemsScreen

const styles1 = StyleSheet.create({
    panelButton: {
        padding: 14,
        borderRadius: 8,
        backgroundColor: constants.colorPrimary,
        alignItems: 'center',
        marginVertical: 7,
    },
    main: {
        // backgroundColor: '#fff',
        // width: "100%",
        alignSelf: 'center',
        // bottom: -20,
        // position: 'absolute',
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