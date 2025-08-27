import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    View,
    Text,
    FlatList
} from 'react-native';
import constants from '../../../constants/constants';
import JsonServer from '../../../Api/api/JsonServer';
import { DataContext } from '../../../Context/context-provider';
import styles from '../../../Styles/Style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropdownAlert from 'react-native-dropdownalert';


const CMWOQuestionnaireTemplateName = ({ route, navigation }) => {

    const { getAPICall, postSubmitWORequest, putRequest, userCredential, setAcceptedWos, saveToAsyncStorageCMWOQuestionsData } = useContext(DataContext)
    let dropDownAlertRef = useRef(null);
    const [dataSource, setDataSource] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);
    const [questionsDatoFromAsyncfromAsyncStorage, setQuestionsDatoFromAsyncStorage] = useState([]);
    const [loading, setLoading] = useState(false)

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "CM " + route.params.screenName + " Checklist"
        });

    }, [navigation]);

    useEffect(() => {
        AsyncStorage.getItem('CMWOQuestionsData').then((value) => {
            if (value == null || value == "null") {
                setLoading(true)
                var url = JsonServer.baseURL + "services/app/WorkOrder/GetAllQuestionnaireTemplateWithQuestionsByWorkOrderId?Id=" + route.params.WOId;
                getAPICall(url, (success, result, error) => {

                    if (success == true) {

                        if (result.items.length > 0) {
                            var dataSourceList = [];
                            var CMQuestionsTemplates = [];
                            CMQuestionsTemplates.push({ WO: route.params.WOId, Data: result.items[0] });
                            setQuestionsDatoFromAsyncStorage(CMQuestionsTemplates)
                            saveToAsyncStorageCMWOQuestionsData(CMQuestionsTemplates);
                            setAllQuestions(result.items[0]);
                            result.items[0].questionTemplates.forEach(function (item) {
                                dataSourceList.push({
                                    value: constants.colorMainBg,
                                    name: item.name,
                                    questions: item.questions,
                                    id: item.id
                                })
                            });
                            setDataSource(dataSourceList);
                            setLoading(false)

                        }
                    }
                    else {
                        setLoading(false)
                        //
                        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
                    }
                })
            }
            else {
                setLoading(true)
                var dataSourceList = [];
                var questionsDatoFromAsync = JSON.parse(value);
                if (questionsDatoFromAsync.filter(x => x.WO == route.params.WOId).length > 0) {
                    setQuestionsDatoFromAsyncStorage(questionsDatoFromAsync)
                    saveToAsyncStorageCMWOQuestionsData(questionsDatoFromAsync);
                    setAllQuestions(questionsDatoFromAsync.find(x => x.WO == route.params.WOId).Data);
                    questionsDatoFromAsync.find(x => x.WO == route.params.WOId).Data.questionTemplates.forEach(function (item) {
                        dataSourceList.push({
                            value: constants.colorMainBg,
                            name: item.name,
                            questions: item.questions,
                            id: item.id
                        })
                    });
                    setDataSource(dataSourceList);
                    setLoading(false)

                }
                else {
                    setLoading(true)
                    var url = JsonServer.baseURL + "services/app/WorkOrder/GetAllQuestionnaireTemplateWithQuestionsByWorkOrderId?Id=" + route.params.WOId;
                    getAPICall(url, (success, result, error) => {
                        if (success == true) {
                            if (result.items.length > 0) {
                                var dataSourceList = [];
                                var CMQuestionsTemplates = questionsDatoFromAsync;
                                CMQuestionsTemplates.push({ WO: route.params.WOId, Data: result.items[0] });
                                setQuestionsDatoFromAsyncStorage(CMQuestionsTemplates)
                                saveToAsyncStorageCMWOQuestionsData(CMQuestionsTemplates);
                                setAllQuestions(result.items[0]);
                                result.items[0].questionTemplates.forEach(function (item) {
                                    dataSourceList.push({
                                        value: constants.colorMainBg,
                                        name: item.name,
                                        questions: item.questions,
                                        id: item.id
                                    })
                                });
                                setDataSource(dataSourceList);
                                setLoading(false)

                            }
                        }
                        else {
                            setLoading(false)
                            dropDownAlertRef.alertWithType('error', 'Alert', error.message)
                        }
                    })
                }


            }
        })
    }, [])

    const submitWO = () => {

        setLoading(true);
        if (
            allQuestions.questionTemplates.filter((x) => x.readyToSubmit == false)
                .length > 0
        ) {
            // Alert.alert('Please complete compulsory questions');
            dropDownAlertRef.alertWithType('error', 'Alert', "Please complete compulsory questions");
            setLoading(false);
        } else {
            var allQuestionsTosubmit = allQuestions;
            allQuestionsTosubmit.id = route.params.WOId;
            var dataToInsert = {
                allQuestions: allQuestions,
            };
            postSubmitWORequest(
                dataToInsert,
                JsonServer.baseURL +
                'services/app/WorkOrderAnswer/CreateWorkOrderAnswer',
                () => {
                    var dataToInsert = {
                        status: 'Closed',
                        id: route.params.WOId,
                    };
                    putRequest(
                        dataToInsert,
                        JsonServer.baseURL + 'services/app/WorkOrder/UpdateWorkOrderStatus',
                        () => {
                            var userName = JSON.parse(userCredential).userNameOrEmailAddress;
                            var url =
                                JsonServer.baseURL +
                                'services/app/WorkOrder/GetAllWorkOrderByUserNameAndStatus?UserName=' +
                                userName +
                                '&Status=Accepted';
                            getAPICall(url, (success, result, error) => {
                                if (success == true) {
                                    setLoading(false);
                                    // Alert.alert('You have submitted work order successfully');
                                    dropDownAlertRef.alertWithType('success', 'Alert', "You have submitted work order successfully");
                                    setAcceptedWos(result.items);
                                    saveToAsyncStorageCMWOQuestionsData(
                                        questionsDatoFromAsyncfromAsyncStorage.filter(
                                            (x) => x.WO != route.params.WOId,
                                        ),
                                    );
                                    navigation.pop(2);
                                } else {
                                    setLoading(false);
                                    dropDownAlertRef.alertWithType(
                                        'error',
                                        'Alert',
                                        error.message,
                                    );
                                }
                            });
                        },
                    );
                },
            );
        }
    };

    const renderItem = (item, index) => {
        return (
            <TouchableOpacity
                onPress={() => {

                    navigation.navigate("CMWOQuestionnaireQuestionsMainPage", { questionsDatoFromAsyncfromAsyncStorage: questionsDatoFromAsyncfromAsyncStorage, allQuestions: allQuestions, WOId: route.params.WOId, WOQuestionnaireQuestionsMainPageItemData: item, WOQuestionnaireQuestionsMainPageData: item.questions, screenName: item.name })
                }}
                style={{
                    height: 70,
                    flex: 1,
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 15,
                    borderWidth: 1,
                    borderColor: constants.colorNavyBlue,
                    borderRadius: 5,
                    backgroundColor: item.value,
                }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text
                        style={{
                            fontSize: 14,
                            color: 'white',
                            fontFamily: constants.FontFamilyRegular,
                        }}>
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }


    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
            }}>

            <View style={{ flex: 1, position: 'absolute', top: "40%", right: 0, left: 0 }}>
                <ActivityIndicator size="large" animating={loading} color={constants.colorPrimary} style={{}} />
            </View>
            {dataSource.length > 0 ? (
                <FlatList
                    style={{}}
                    data={dataSource}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => renderItem(item, index)}
                />
            ) : (
                <View></View>
            )}
            <TouchableOpacity disabled={loading ? true : false} onPress={() => submitWO()} style={styles.LoginButton}

            >
                <Text style={styles.buttonTextSmall}>Submit</Text>
            </TouchableOpacity>
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

}

export default CMWOQuestionnaireTemplateName;
