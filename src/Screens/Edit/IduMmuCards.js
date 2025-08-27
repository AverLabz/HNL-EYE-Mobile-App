import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useContext, useEffect, forwardRef, useRef, useImperativeHandle, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../Api/api/JsonServer';

const IduMmuCards = React.forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        childMethod() {
            getAll_IDUMMUStatus();
            getAll_LbVerification();
        }
    }))

    const { getAPICall, putRequest } = useContext(DataContext)
    //States For TextInputs
    let dropDownAlertRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState("")
    const [type, setType] = useState("");
    const [serial, setSerial] = useState("");
    const [siteId, setSiteId] = useState('')
    const [rowId, setRowId] = useState('')
    //    state for dropdown
    const [openVerification, setOpenVerification] = useState(false);
    const [verificationValue, setVerificationValue] = useState(null);
    const [verificationItems, setVerificationItems] = useState([]);

    const [openActive, setOpenActive] = useState(false);
    const [activeValue, setActiveValue] = useState(null);
    const [activeItems, setActiveItems] = useState([]);
    const [serialImagePairs, setSerialImagePairs] = useState([])

    useEffect(() => {
        setLoading(true)
        getAll_IDUMMUStatus();
        getAll_LbVerification();
    }, [])

    const getAll_IDUMMUStatus = () => {

        var url = JsonServer.baseURL + "services/app/IDUMMUStatus/GetAll";
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result.totalCount > 0) {

                    let idummuStatus = [];
                    result.items.forEach((itemsElement) => {
                        idummuStatus.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setActiveItems(idummuStatus);
                    if (props.siteIdToSend != null)
                    GetAll_IDUMMUCards(props.siteIdToSend);
                }
                setLoading(false);
            } else {
                setLoading(false);
            }
        })
    }


    const getAll_LbVerification = () => {

        var url = JsonServer.baseURL + "services/app/LbVerification/GetAll";
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result.totalCount > 0) {

                    let verificationItems = [];
                    result.items.forEach((itemsElement) => {
                        verificationItems.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setVerificationItems(verificationItems);
                    if (props.siteIdToSend != null)
                        GetAll_IDUMMUCards(props.siteIdToSend);
                }
            }
        })
    }


    const GetAll_IDUMMUCards = (id) => {
        setLoading(true)

        var url = JsonServer.baseURL + "services/app/AMS/GetAll_IDUMMUCards?SiteId=" + id
        getAPICall(url, (success, result, error) => {
            if (success) {

                if (result.items.length > 0) {
                    setType(result.items[0].siteTypeName)
                    setQuantity(result.items[0].quantity.toString())
                    setSerial(result.items[0].serialNumber)
                    setActiveValue(result.items[0].idummuStatusId);
                    setVerificationValue(result.items[0].lbVerificationId)
                    setSiteId(result.items[0].siteId);
                    setRowId(result.items[0].id);
                    setLoading(false)
                } else {
                    setLoading(false);
                }
            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }


    const handleUpdateData = () => {
        setLoading(true)
        var url = JsonServer.baseURL + "services/app/AMS/Update";
        let dataToInsert = {
            dto: {
                idummuCard: {
                    site_Id: siteId,
                    type: type,
                    quantity: quantity,
                    serialNumber: serial,
                    idummuStatus_Id: activeValue,
                    lbVerification_Id: verificationValue,
                    id: rowId,
                    serialImagePairs: serialImagePairs,
                }
            }
        }
        putRequest(dataToInsert, url, (success, result, error) => {
            if (success) {
                setLoading(false)
                dropDownAlertRef.alertWithType('success', 'Alert', "Data has been updated")

            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: constants.lightGrayColor }}>
                {loading ?
                    <View style={{ flex: 1, marginTop: "55%" }}>
                        <ActivityIndicator
                            size="large"
                            animating={loading}
                            color={constants.colorPrimary}
                            style={{}}
                        />
                    </View> :
                    <View style={{ marginTop: 10 }}>

                        {props.siteIdToSend && <View style={styles.viewContainer}>
                            <TouchableOpacity style={styles.btnContainer} onPress={() => props.onIduMMUCardPress("iduMMUCardPress", setSerialImagePairs, props.siteIdToSend)}>
                                <Text style={{ color: "white" }}>Serial Number</Text>
                            </TouchableOpacity>
                        </View>}

                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Type :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setType(text)}
                                value={type}
                                placeholder=" Add Type:"
                                keyboardType="default" />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Quantity  :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setQuantity(text)}
                                value={quantity}
                                placeholder="Add Quantity"
                                keyboardType="default" />
                        </View>
                        {/* <View style={styles.viewstyle}>
                        <Text style={styles.textstyle}>Serial Number :</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setSerial(text)}
                            value={serial}
                            placeholder="Add Serial Number"
                            keyboardType="default" />
                    </View> */}
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}> Status :</Text>
                            <DropDownPicker
                                open={openActive}
                                value={activeValue}
                                items={activeItems}
                                setOpen={setOpenActive}
                                setValue={setActiveValue}
                                setItems={setActiveItems}
                                placeholder="Select Idu Mmu..."
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
                        </View>


                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Lb Verification:</Text>
                            <DropDownPicker
                                open={openVerification}
                                value={verificationValue}
                                items={verificationItems}
                                setOpen={setOpenVerification}
                                setValue={setVerificationValue}
                                setItems={setVerificationItems}
                                placeholder="Select Verification"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
                        </View>
                        <View style={styles.panel}>
                            <TouchableOpacity onPress={() => handleUpdateData()} style={styles.panelButton}>
                                <Text style={styles.panelButtonTitle}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}

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
})

export default IduMmuCards
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: Platform.OS == "ios" ? 15 : 10,
        backgroundColor: '#fff'
    },
    DropDownPicker: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: 'black',
    },
    viewstyle: {
        margin: 10,
        marginHorizontal: 20
    },
    textstyle: {
        paddingBottom: 10
    },
    panel: {
        margin: 10,
        marginHorizontal: 20
    },
    panelButton: {
        padding: 14,
        borderRadius: 8,
        backgroundColor: constants.colorPrimary,
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    viewContainer: { alignItems: "flex-end", justifyContent: "flex-end", marginRight: 20 },
    btnContainer: { backgroundColor: constants.colorPrimary, padding: 10 }
});