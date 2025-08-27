import { StyleSheet, Text, View, Switch, TextInput, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableOpacity } from 'react-native';
import constants from '../../constants/constants';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';
import DropdownAlert from 'react-native-dropdownalert';
import SwitchToggle from "react-native-switch-toggle";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Style';
import CustomLoader from '../../Components/CustomLoader/CustomLoader';


const CreateCM = ({ navigation }) => {
    const { getAPICall, postRequest } = useContext(DataContext)
    let dropDownAlertRef = useRef(null);


    const [openEmploy, setOpenEmploy] = useState(false);
    const [employValue, setEmployValue] = useState(null);
    const [employItems, setEmployItems] = useState([]);

    const [openAlarm, setOpenAlarm] = useState(false);
    const [alarmValue, setAlarmValue] = useState(null);
    const [alarmItems, setAlarmItems] = useState([]);

    const [openSite, setOpenSite] = useState(false);
    const [siteValue, setSiteValue] = useState(null);
    const [siteItems, setSiteItems] = useState([]);

    const [employ, setEmploy] = useState([])
    const [site, setSite] = useState([])

    const [selectedSite, setSelectedSite] = useState('')
    const [selectedEmploy, setSelectedEmploy] = useState('')
    const [currentEmpId, setCurrentEmpId] = useState(0)
    const [remarks, setRemarks] = useState('')

    const [loading, setLoading] = useState(true)
    const [toggle, setToggle] = useState(true);
    useFocusEffect(
        React.useCallback(() => {
            AsyncStorage.getItem("userId").then((value) => {
                setCurrentEmpId(JSON.parse(value))
                console.log('Employe Id', JSON.parse(value))
            })
        }, [])
    )
    useEffect(() => {
        getAllEmploy()
        getAllSites()
    }, [])

    const getAllEmploy = () => {
        var url = JsonServer.baseURL + "services/app/Suggestions/GetEmployees?SkipCount=0&MaxResultCount=100&OnlyAllocated=true&OnlyPresent=true";
        getAPICall(url, (success, result, error) => {

            if (success) {
                if (result.length > 0) {
                    let employTempArr = [];
                    result.forEach((itemsElement) => {
                        employTempArr.push({
                            label: itemsElement.employeeName + ' ' + itemsElement.erpId,
                            value: itemsElement.employeeId,
                        });
                    });
                    setEmploy(employTempArr)
                    setLoading(false)
                }

            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }
    const getAllSites = () => {
        var url = JsonServer.baseURL + "services/app/Suggestions/GetSites?MaxResultCount=10000&OnlyRegional=true";
        getAPICall(url, (success, result, error) => {
            if (success) {

                if (result.totalCount > 0) {

                    let siteTempArr = [];
                    result.items.forEach((itemsElement) => {
                        siteTempArr.push({
                            label: itemsElement.siteCode,
                            value: itemsElement.siteId,
                        });
                    });
                    setSite(siteTempArr)
                    setLoading(false)
                }

            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }
    const createCM = () => {
        var url = JsonServer.baseURL + 'services/app/WorkOrder/CreateCm'
        let dataToInsert = {
            siteId: selectedSite,
            employeeId: toggle ? selectedEmploy : currentEmpId,
            isVisitRequired: toggle,
            description: remarks
        }
        console.log('dataToInsert', dataToInsert)
        postRequest(dataToInsert, url, (success, result, error) => {
            if (result) {
                dropDownAlertRef.alertWithType('success', 'Success', result)
                setTimeout(() => {
                    setLoading(false)
                    navigation.goBack()
                }, 1200);
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        });
    }



    return (
        <SafeAreaView style={styles.container}>
            {loading && <CustomLoader medium />}
            <View style={styles.Container}>
                <View style={styles.SubView}>
                    <Text style={styles.Text}>Is Visit required ?</Text>

                    <SwitchToggle switchOn={toggle} onPress={() => setToggle(!toggle)}
                        circleColorOff='#fff'
                        circleColorOn='#fff'
                        backgroundColorOn={constants.colorPrimary}
                        backgroundColorOff='#E9E9EB'
                        containerStyle={{
                            margin: 15,
                            width: 70,
                            height: 38,
                            borderRadius: 25,
                            padding: 5,
                        }}
                        circleStyle={{
                            width: 30,
                            height: 30,
                            borderRadius: 20,
                        }} />
                    <Text style={styles.Text}>{toggle ? "Yes" : "No"}</Text>
                </View>
                {toggle && <View style={styles.ViewStyle}>
                    <DropDownPicker
                        open={openEmploy}
                        value={employValue}
                        items={employ}
                        setOpen={setOpenEmploy}
                        setValue={setEmployValue}
                        setItems={setEmployItems}
                        placeholder="Select Employ"
                        style={styles.DropDownPicker}
                        searchable
                        listMode="MODAL"
                        onChangeValue={(item) => {
                            setSelectedEmploy(item)
                        }}
                        placeholderStyle={{
                            color: constants.grayColor,
                            fontFamily: constants.fontRegular,
                        }}
                        listItemLabelStyle={{
                            color: constants.defaultTextBlack,
                            fontFamily: constants.fontRegular,
                        }} />
                </View>}

                <View style={styles.ViewStyle}>
                    <DropDownPicker
                        open={openSite}
                        value={siteValue}
                        items={site}
                        setOpen={setOpenSite}
                        setValue={setSiteValue}
                        setItems={setSiteItems}
                        placeholder="Select Site"
                        style={styles.DropDownPicker}
                        searchable
                        onChangeValue={(item) => {
                            setSelectedSite(item)
                        }}
                        listMode="MODAL"
                        placeholderStyle={{
                            color: constants.grayColor,
                            fontFamily: constants.fontRegular,
                        }}
                        listItemLabelStyle={{
                            color: constants.defaultTextBlack,
                            fontFamily: constants.fontRegular,
                        }} />
                </View>
                <View>
                    <TextInput
                        placeholder='Add Remarks'
                        style={styles.TextInput}
                        value={remarks}
                        onChangeText={(text) => {
                            setRemarks(text)
                        }}
                    />
                </View>
                <View style={styles.panel}>
                    <TouchableOpacity disabled={loading} style={styles.panelButton} onPress={() => {
                        setLoading(true)
                        createCM()
                    }}>
                        <Text style={styles.panelButtonTitle}>Submit</Text>
                    </TouchableOpacity>
                </View>

                <DropdownAlert
                    ref={(ref) => {
                        if (ref) {
                            dropDownAlertRef = ref;
                        }
                    }}
                    showCancel={true}
                />
            </View>
        </SafeAreaView>
    )
}

export default CreateCM

// const styles = StyleSheet.create({
//     flex: {
//         flex: 1
//     },
//     Container: {
//         flex: 1,
//         marginHorizontal: 10,
//         justifyContent: 'center'
//     },
//     SubView: {
//         alignItems: 'center',
//         flexDirection: 'row',
//         justifyContent: 'center'
//     },
//     Text: { fontSize: 20, color: constants.colorPrimary, fontWeight: 'bold' },
//     DropDownPicker: {
//         backgroundColor: constants.colorWhite,
//         borderWidth: 1,
//         borderColor: constants.blackText,
//         width: "100%"
//     },
//     TextInput: {
//         backgroundColor: constants.colorWhite,
//         borderWidth: 1.2,
//         borderColor: constants.blackText,
//         width: "100%",
//         borderRadius: 5,
//         paddingHorizontal: 8
//     },
//     panelButtonTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: constants.colorWhite,
//     },
//     panelButton: {
//         padding: 14,
//         borderRadius: 8,
//         backgroundColor: constants.colorPrimary,
//         alignItems: 'center',
//         marginVertical: 10
//     },
//     ViewStyle: {
//         marginVertical: 10,
//     },
//     loader:{
//         flexGrow:0,
//         zIndex:100,
//         top:0,
//         left:0,
//         right:0,
//         bottom:0,
//         position:'relative'
//     }
// })