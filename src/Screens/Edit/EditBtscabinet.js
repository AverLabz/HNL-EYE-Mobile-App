import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useContext, useEffect, forwardRef, useRef, useImperativeHandle, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import constants from '../../constants/constants';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';
import DropdownAlert from 'react-native-dropdownalert';

const EditBtscabinet = React.forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        childMethod() {
            getAllServingTechnology();
        }
    }))
    const { getAPICall, putRequest } = useContext(DataContext)
    let dropDownAlertRef = useRef(null);
    //States For TextInputs
    const [dbc, setDbc] = useState("");
    const [fiber, setFiber] = useState("")
    const [siteId, setSiteId] = useState("")
    const [rowId, setrowId] = useState("")


    //States For Dropdowns
    const [openSidecode, setOpenSidecode] = useState(false);
    const [sidecodeValue, setSidecodeValue] = useState(null);
    const [sidecodeItems, setSidecodeItems] = useState([]);

    const [openTechnology, setOpenTechnology] = useState(false);
    const [technologyValue, setTechnologyValue] = useState(null);
    const [technologyItems, setTechnologyItems] = useState([]);

    const [openActive, setOpenActive] = useState(false);
    const [activeValue, setActiveValue] = useState(null);
    const [activeItems, setActiveItems] = useState([{
        label: "True",
        value: true,
    }, {
        label: "False",
        value: false,
    }]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        getAllServingTechnology();
    }, [])

    const getAllServingTechnology = () => {
        var url = JsonServer.baseURL + "services/app/ServingTechnology/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {
                    let servingTEchnologyTempArr = [];
                    result.items.forEach((itemsElement) => {
                        servingTEchnologyTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setTechnologyItems(servingTEchnologyTempArr);
                    if (props.siteIdToSend != null)
                        getAllBTSCabinet(props.siteIdToSend);
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const getAllBTSCabinet = (id) => {
        setLoading(true)
        var url = JsonServer.baseURL + "services/app/AMS/GetAll_MainBtsCabinet?SiteId=" + id
        getAPICall(url, (success, result, error) => {

            if (success) {
                if (result.items.length > 0) {
                    setDbc(result.items[0].noOfDBC.toString());
                    setFiber(result.items[0].noOfFibers.toString());
                    setTechnologyValue(result.items[0].servingTechnologyId);
                    setActiveValue(result.items[0].isActive);
                    setSiteId(result.items[0].siteId);
                    setrowId(result.items[0].id);

                    setLoading(false)
                } else {
                    setLoading(false);
                }
            }
            else {
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
                mainBtsCabinet: {
                    site_Id: siteId,
                    servingTechnology_Id: technologyValue,
                    noOfDBC: dbc,
                    noOfFibers: fiber,
                    isActive: activeValue,
                    id: rowId
                }
            }
        }
        putRequest(dataToInsert, url, (success, result, error) => {
            if (success) {
                dropDownAlertRef.alertWithType('success', 'Alert', "Data has been updated")
                setLoading(false)
            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flexGrow: 1, backgroundColor: constants.lightGrayColor }}>
                {loading ?
                    <View style={{ flex: 1, marginTop: "55%", }}>
                        <ActivityIndicator
                            size="large"
                            animating={loading}
                            color={constants.colorPrimary}
                            style={{}}
                        />
                    </View> :
                    <View style={{ marginTop: 10, }}>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Serving Technology :</Text>
                            <DropDownPicker
                                open={openTechnology}
                                value={technologyValue}
                                items={technologyItems}
                                setOpen={setOpenTechnology}
                                setValue={setTechnologyValue}
                                setItems={setTechnologyItems}
                                placeholder="Select Technology"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>No of DBC :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setDbc(text)}
                                value={dbc}
                                placeholder="Add No of DBC"
                                keyboardType="default" />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>No of Fibers :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setFiber(text)}
                                value={fiber}
                                placeholder=" Select No of Fibers"
                                keyboardType="default" />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}> IsActive :</Text>
                            <DropDownPicker
                                open={openActive}
                                value={activeValue}
                                items={activeItems}
                                setOpen={setOpenActive}
                                setValue={setActiveValue}
                                setItems={setActiveItems}
                                placeholder="False"
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

export default EditBtscabinet
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
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
});