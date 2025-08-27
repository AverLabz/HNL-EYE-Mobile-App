import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, LogBox, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import { DataContext } from '../../../Context/context-provider';
import styles from '../../../Styles/Style';

import constants from '../../../constants/constants';
import CMQuestionsWithInputScreen from '../CMWOQuestionnaireScreens/CMQuestionsWithInputScreen';
import CMQuestionsWithOptionsScreen from '../CMWOQuestionnaireScreens/CMQuestionsWithOptionsScreen';

const CMWOQuestionnaireQuestionsMainPage = ({ route, navigation }) => {

    const { setImageSource, saveToAsyncStorageCMWOQuestionsData, isLoadingActivityIncatorForImage } = useContext(DataContext)
    // variable to get data from database / file 
    const [QuestionsInitialData, setQuestionsData] = useState(route.params.WOQuestionnaireQuestionsMainPageData);
    const [allQuestions, setAllQuestions] = useState(route.params.allQuestions);
    // variable to fill flat list
    const [QuestionnaireData, setQuestionnaireData] = useState([]);
    // variable to send data to questions screen
    const [QuestionScreenData, setQuestionScreenData] = useState({
        id: 1, count: 1, answerTypeId: route.params.WOQuestionnaireQuestionsMainPageData[0].id, isRequired: route.params.WOQuestionnaireQuestionsMainPageData[0].isRequired, isImageRequired: route.params.WOQuestionnaireQuestionsMainPageData[0].isImageRequired,
        answerTypeName: route.params.WOQuestionnaireQuestionsMainPageData[0].answerTypeName, question: route.params.WOQuestionnaireQuestionsMainPageData[0].questionText, options: route.params.WOQuestionnaireQuestionsMainPageData[0].option
    });
    const [selectedId, setSelectedId] = useState(1);
    const flatListRef = useRef();

    const SetSelectOption = (data) => {
        setSetSelected(data)
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:route.params.screenName
          });
        
      }, [navigation]);

    const onPressFlatListIndex = (item) => {

        setQuestionScreenData(item);
        setSelectedId(item.id)

    }
    const onPressFlatListIndexDecrement = (item) => {
        setQuestionScreenData(item);
        setSelectedId(item.id)

    }
    const getValueFromIncremental = (counter) => {
        
        if (QuestionsInitialData[counter - 1].answerTypeName == "Input" && QuestionsInitialData[counter - 1].isRequired && QuestionsInitialData[counter - 1].answerText == null) {
            Alert.alert("Answer required for Input")
        }
        else if (QuestionsInitialData[counter - 1].answerTypeName == "Dropdown" && QuestionsInitialData[counter - 1].isRequired && QuestionsInitialData[counter - 1].optionText == null) {
            Alert.alert("Answer required for dropdown")
        }
        else if (QuestionsInitialData[counter - 1].answerTypeName == "Input" && QuestionsInitialData[counter - 1].isImageRequired == true && QuestionsInitialData[counter - 1].imageUrl == null) {
            Alert.alert("Image Required")
        }
        else if (QuestionsInitialData[counter - 1].answerTypeName == "Dropdown" && QuestionScreenData.options.find(x => x.id == QuestionsInitialData.find(x => x.id == QuestionScreenData.answerTypeId).optionId) !== undefined &&
            QuestionScreenData.options.find(x => x.id == QuestionsInitialData.find(x => x.id == QuestionScreenData.answerTypeId).optionId).isImageRequired == true && QuestionsInitialData[counter - 1].imageUrl == null) {

            Alert.alert("Image Required")
        }
        else {

            if (counter == null) {

            }
            else {
                var valueAtIndex = QuestionnaireData[counter];
                setImageSource(QuestionsInitialData[counter].imageUrl)
                onPressFlatListIndex(valueAtIndex);
            }
        }

    }
    const getValueFromDecermental = (counter) => {
        if (counter == null) { }
        else {
            var counter = counter - 2;
            var valueAtIndexDecrement = QuestionnaireData[counter];
            onPressFlatListIndexDecrement(valueAtIndexDecrement);
        }
    }
    const submitQuestionnaires = (counter) => {

        if (QuestionsInitialData[counter - 1].answerTypeName == "Input" && QuestionsInitialData[counter - 1].isRequired && QuestionsInitialData[counter - 1].answerText == null) {
            Alert.alert("Answer required for Input")
        }
        else if (QuestionsInitialData[counter - 1].answerTypeName == "Dropdown" && QuestionsInitialData[counter - 1].isRequired && QuestionsInitialData[counter - 1].optionText == null) {
            Alert.alert("Answer required for dropdown")
        }
        else if (QuestionsInitialData[counter - 1].answerTypeName == "Input" && QuestionsInitialData[counter - 1].isImageRequired == true && QuestionsInitialData[counter - 1].imageUrl == null) {
            Alert.alert("Image Required")
        }
        // else if (QuestionsInitialData[counter - 1].answerTypeName == "Dropdown" &&
        //     QuestionScreenData.options.find(x => x.id == QuestionsInitialData.find(x => x.id == QuestionScreenData.answerTypeId).optionId).isImageRequired == true && QuestionsInitialData[counter - 1].imageUrl == null) {
        //     Alert.alert("Image Required")
        // }
        else {

            Alert.alert("You have completed questionnaire successfully");
            route.params.questionsDatoFromAsyncfromAsyncStorage.find(x => x.WO == route.params.WOId).Data.questionTemplates.find(x => x.id == route.params.WOQuestionnaireQuestionsMainPageItemData.id).readyToSubmit = true;
            saveToAsyncStorageCMWOQuestionsData(route.params.questionsDatoFromAsyncfromAsyncStorage);

            route.params.allQuestions.questionTemplates.find(x => x.id == route.params.WOQuestionnaireQuestionsMainPageItemData.id).readyToSubmit = true;
            if (counter == null) {
            }
            else {
                navigation.goBack();
            }

        }
    }
    useEffect(() => {
        //Read data from file and start pushing into QuestionnaireData to make data ready for flatlist
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        var inceremental = 1;
        var QuestionnaireDataToSetState = [];

        QuestionsInitialData.map((data) => {
            QuestionnaireDataToSetState.push({ isRequired: data.isRequired, isImageRequired: data.isImageRequired, id: inceremental, answerTypeId: data.id, answerTypeName: data.answerTypeName, count: inceremental, question: data.questionText, options: data.option });
            inceremental++;
        })
        setQuestionnaireData(QuestionnaireDataToSetState);
    }, [])

    //#region Horizontal Flatlist Population

    const HorizontalFlatlistRenderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? constants.colorPrimary : "white";
        const fontColor = item.id === selectedId ? "white" : "black";
        return (
            <HorizontalFlatlistItem
                item={item}
                onPress={() => {
                    onPressFlatListIndex(item)

                }}
                HorizontalFlatlistItemStyle={{ backgroundColor, fontColor }}
            />
        );
    };
    const HorizontalFlatlistItem = ({ item, onPress, HorizontalFlatlistItemStyle }) => {
        return (
            <View style={{
                margin: 10
            }}
            >
                <TouchableOpacity style={[styles.circularViewSelected, HorizontalFlatlistItemStyle]}>
                    {/* <TouchableOpacity onPress={onPress} style={[styles.circularViewSelected, HorizontalFlatlistItemStyle]}> */}
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: HorizontalFlatlistItemStyle.fontColor }}>{item.count}</Text>

                </TouchableOpacity>
            </View>
        )
    };
    //#endregion



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={constants.colorPrimary} />
            <SafeAreaView style={{flex:1}}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                >
                    <FlatList
                        style={{ flexGrow: 0, marginTop: 5, marginBottom: 5 }}
                        ref={flatListRef}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={QuestionnaireData}
                        keyExtractor={(item) => item.id}
                        extraData={selectedId}
                        renderItem={(item, index) => HorizontalFlatlistRenderItem(item, index)}
                    />
                    {QuestionScreenData.answerTypeName == "Dropdown" ?
                        <CMQuestionsWithOptionsScreen navigation={navigation} wOQuestionnaireQuestionsMainPageItemData={route.params.WOQuestionnaireQuestionsMainPageItemData} questionsDatoFromAsyncfromAsyncStorage={route.params.questionsDatoFromAsyncfromAsyncStorage} navigation={navigation} WOId={route.params.WOId} QuestionsInitialData={QuestionsInitialData} questionScreenData={QuestionScreenData} SetSelectOption={SetSelectOption}></CMQuestionsWithOptionsScreen>
                        : <CMQuestionsWithInputScreen wOQuestionnaireQuestionsMainPageItemData={route.params.WOQuestionnaireQuestionsMainPageItemData} questionsDatoFromAsyncfromAsyncStorage={route.params.questionsDatoFromAsyncfromAsyncStorage} navigation={navigation} WOId={route.params.WOId} QuestionsInitialData={QuestionsInitialData} questionScreenData={QuestionScreenData}></CMQuestionsWithInputScreen>}

                    <View style={{ position: 'absolute', top: "50%", right: 0, left: 0 }}>
                        <ActivityIndicator size="large" animating={isLoadingActivityIncatorForImage} color={constants.colorPrimary} style={{}} />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: "space-between", padding: 20 }}>
                        {selectedId == 1
                            ?
                            <TouchableOpacity disabled={true} style={{ flex: 1, backgroundColor: constants.colorPrimary, height: 50, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => getValueFromDecermental(selectedId)}
                            >
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Previous</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={{ flex: 1, backgroundColor: constants.colorPrimary, height: 50, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => getValueFromDecermental(selectedId)}
                            >
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Previous</Text>
                            </TouchableOpacity>
                        }

                        {
                            selectedId === QuestionnaireData.length ?
                                <TouchableOpacity style={{ flex: 1, backgroundColor: constants.colorPrimary, height: 50, borderRadius: 40, marginLeft: 30, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => submitQuestionnaires(selectedId)}
                                >
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Submit</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={{ flex: 1, backgroundColor: constants.colorPrimary, height: 50, borderRadius: 40, marginLeft: 30, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => getValueFromIncremental(selectedId)}

                                >
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Next</Text>
                                </TouchableOpacity>
                        }
                    </View>



                </ScrollView>
            </SafeAreaView>
        </SafeAreaView>
    )
}



export default CMWOQuestionnaireQuestionsMainPage