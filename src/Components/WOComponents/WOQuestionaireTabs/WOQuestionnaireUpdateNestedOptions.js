import moment from 'moment';
import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import DropdownAlert from 'react-native-dropdownalert';
import ImageMarker, { Position } from "react-native-image-marker";
import { launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { RadioButton } from 'react-native-paper';
import JsonServer from '../../../Api/api/JsonServer';
import { DataContext } from '../../../Context/context-provider';
import constants from '../../../constants/constants';


const WOQuestionnaireUpdateNestedOptions = ({ navigation, route }) => {
    const { getCurretLocation, ConvertImageToBase64, postRequest, woSiteCode } = useContext(DataContext)
    const [QuestionsInitialData, setQuestionsInitialData] = useState(route.params.templateQuestions.questions);
    let dropDownAlertRef = useRef(null);
    const flatListRef = useRef();
    const [selectedId, setSelectedId] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState(null)
    const [selectedOptionIdForDbSend, setSelectedOptionIdForDbSend] = useState(0)
    const [name, setName] = useState(null)
    const [imageSource, setImageSource] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const [imageLoader, setImageLoader] = useState(false)
    const [currentLongitude, setCurrentLongitude] = useState('');
    const [currentLatitude, setCurrentLatitude] = useState('');
    const [nestedAnswerFillingDataState, setNestedAnswerFillingDataState] = useState([]);

    const getIndex = (selectedQuestionIndex, callback) => {
        
        if (route.params.templateQuestions.questions[selectedQuestionIndex].answerType != "Input") {
            var index = route.params.filledAnswers?.findIndex(x => x.questionText == route.params.templateQuestions[0]?.questions[selectedQuestionIndex].questionText);
            var dropDownIndex = route.params.templateQuestions[0]?.questions[selectedQuestionIndex]?.options.findIndex(x => x.option.id == route.params.templateQuestions[0]?.questions[selectedQuestionIndex].options[route.params.templateQuestions[0].questions[selectedQuestionIndex].options.findIndex(x => x.option.name == route.params.filledAnswers[index].answerText)].option.id);
            setSelectedOptionId(dropDownIndex);
            callback(dropDownIndex);
        }
        else {
            var index = route.params.filledAnswers?.findIndex(x => x.questionText == route.params.templateQuestions[0].questions[selectedQuestionIndex].text);
            setName(route.params.filledAnswers[index]?.answerText ? route.params.filledAnswers[index]?.answerText : "");
            callback(index)
        }
    }

    useLayoutEffect(() => {

        getIndex(selectedId, (getIndex) => {

        });

        navigation.setOptions({
            headerTitle: () => (
                <Text style={{ fontSize: 16, fontWeight: "700", color: constants.colorWhite }}>{route.params.templateQuestions.option.name}</Text>
            ),
        })
        setNestedAnswerFillingDataState(route.params.nestedAnswerArray)

        if (route.params.nestedAnswerArray?.length > 0) {
            
            var onPageResult = route.params.nestedAnswerArray[0];
            setImgUrl(onPageResult.imagePath ? onPageResult.imagePath : '');
            setSelectedOptionId(onPageResult.selectedOptionIndex ? onPageResult.selectedOptionIndex : null)
            setSelectedOptionIdForDbSend(onPageResult.answerText)
            setName(onPageResult.answerText)
        }

        getCurretLocation((location, success) => {
            if (success) {
                setCurrentLatitude(location.coords.latitude);
                setCurrentLongitude(location.coords.longitude);
            }
            else {
                try {
                    const granted = PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log("You can use GPS Location");
                    } else {
                        LocationServicesDialogBox.checkLocationServicesIsEnabled({
                            message: "<h2 style='color: #0af13e'>Use Location ?</h2>App needs access to your location:<br/>",
                            ok: "YES",
                            cancel: "NO",
                            enableHighAccuracy: true,
                            showDialog: true,
                            openLocationServices: true,
                            preventOutSideTouch: false,
                            preventBackClick: false,
                            providerListener: false,
                        }).then(function (success) {
                            console.log(success);
                        }).catch((error) => {
                            console.log(error.message);
                        });
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
        });
    }, [])

    const HorizontalFlatListRenderItem = ({ item, index }) => {

        const backgroundColor = index === selectedId ? constants.colorPrimary : constants.colorWhite;
        const fontColor = index === selectedId ? constants.colorWhite : constants.blackText;
        const borderColor = index === selectedId ? constants.colorPrimary : constants.lightGrayColor;

        return (
            <View style={styles.renderContainer}>
                <TouchableOpacity activeOpacity={1} style={[styles.renderTouchableStyle, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
                    <Text style={[styles.renderTextStyle, { color: fontColor }]}>{index + 1}</Text>
                </TouchableOpacity>
            </View>
        )
    };

    const getImageUrl = (base64) => {

        var url = JsonServer.baseURL + 'services/app/Answer/SaveImage'
        let dataToInsert = {
            base64_Image: base64
        }
        postRequest(dataToInsert, url, (success, result, error) => {

            if (result) {
                setImgUrl(result)
                setImageLoader(false)
            } else {
                setImageLoader(false)
                console.log("Error ", error)
            }
        });
    }

    const selectPhotoTapped = async () => {

        if (currentLongitude == "") {
            Alert.alert("Please Turn On your location");
            navigation.goBack();
        }
        else {
            try {
                await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ]);
                if (
                    (await PermissionsAndroid.check('android.permission.CAMERA')) &&
                    (await PermissionsAndroid.check('android.permission.CAMERA')) &&
                    (await PermissionsAndroid.check('android.permission.CAMERA'))
                ) {
                    try {
                        const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.CAMERA,
                            {
                                title: 'HNL App Camera Permission',
                                message:
                                    'HNL needs access to your camera ' +
                                    'so you can take awesome pictures.',
                                buttonNeutral: 'Ask Me Later',
                                buttonNegative: 'Cancel',
                                buttonPositive: 'OK',
                            },
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            var options = {
                                title: 'Select Profile Image',
                                cancelButtonTitle: 'Cancel',
                                takePhotoButtonTitle: 'Take Photo...',
                                chooseFromLibraryButtonTitle: 'Choose from Library...',
                                chooseFromLibraryButtonHidden: false,
                                noData: false, // we use response.data to display gif
                                allowsEditing: false, // make sure we don't edit the gif
                            };
                            launchCamera(options, response => {
                                if (response.didCancel) {
                                    console.log('User cancelled image picker');
                                } else if (response.error) {
                                    console.log('ImagePicker Error: ', response.error);
                                    console.log(response);
                                } else if (response.customButton) {
                                    console.log(
                                        'User tapped custom button: ',
                                        response.customButton,
                                    );
                                } else {

                                    const options = {
                                        // background image
                                        backgroundImage: {
                                          src: response.assets[0].uri,
                                          scale: 1,
                                        },
                                        watermarkTexts: [{
                                          text: 'Latitude ' + currentLatitude + '\n\nLongitude ' + currentLongitude + '\n\nSite Code : ' + woSiteCode + '\n\nDate: ' + moment().format('MMMM Do YYYY, h:mm'),
                                          position: {
                                            position: Position.bottomLeft,
                                          },
                                          style: {
                                            color: '#9d0000',
                                            fontSize: 30,
                                            fontName: 'Arial',
                                            shadowStyle: {
                                              dx: 10.5,
                                              dy: 20.8,
                                              radius: 20.9,
                                              color: 'rgba(52, 52, 52, 0.8)' // '#ff00ffad'
                                            },
                                            textBackgroundStyle: {
                                              type: 'stretchX',
                                              paddingX: 10,
                                              paddingY: 10,
                                            },
                                          },
                                        }],
                                        scale: 1,
                                        quality: 100,
                                        filename: 'test',
                                      };

                                    ImageMarker.markText(options).then((res) => {
                                        ImageResizer.createResizedImage(
                                            res,
                                            700,
                                            500,
                                            'PNG',
                                            100,
                                        )
                                            .then(({ uri }) => {

                                                ConvertImageToBase64(uri, (result) => {
                                                    setImageSource(result)
                                                    setImageLoader(true)
                                                    getImageUrl(result)

                                                })

                                            })
                                            .catch(err => {
                                                console.log(err);
                                                return Alert.alert(
                                                    'Unable to resize the photo',
                                                    'Check the console for full the error message',
                                                );
                                            });
                                    })

                                }
                            });
                        } else {
                            console.log('Camera permission denied');
                        }
                    } catch (err) {
                        console.warn(err);
                    }
                    return true;
                } else {
                    console.log('all permissions denied');
                    return false;
                }
            } catch (err) {
                console.warn(err);
            }
        }

    }

    const submitQuestionnaires = (counter) => {
        if (nestedAnswerFillingDataState.length > 0) {
            if (nestedAnswerFillingDataState !== undefined) {
                var onPageResult = nestedAnswerFillingDataState[counter + 1];
                if (onPageResult) {

                    // setSelectedId(counter + 1);
                    setImgUrl(onPageResult.imagePath ? onPageResult.imagePath : '');
                    setSelectedOptionId(onPageResult.selectedOptionIndex)
                    setSelectedOptionIdForDbSend(onPageResult.answerText)
                    setName(onPageResult.answerText)
                    nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).text = QuestionsInitialData[counter].text;
                    nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).answerType = QuestionsInitialData[counter].answerType;
                    nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).answerText = name == null ? selectedOptionIdForDbSend : name;
                    nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).selectedOptionIndex = selectedOptionId;
                    nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).imagePath = imgUrl;
                    route.params.setNestedAnswersFromProps(nestedAnswerFillingDataState);
                    navigation.goBack()
                } else {

                    if (QuestionsInitialData[counter].answerType == "Input" && QuestionsInitialData[counter].isQuestionRequired && name == null) {
                        Alert.alert("Input required ")
                    }
                    else if (QuestionsInitialData[counter].answerType == "Dropdown" && QuestionsInitialData[counter].isQuestionRequired && selectedOptionId == null) {
                        Alert.alert("Please select an option")
                    }
                    else if (QuestionsInitialData[counter].answerType == "Dropdown" && QuestionsInitialData[counter].isQuestionRequired && QuestionsInitialData[counter]?.options[selectedOptionId]?.isImageRequired && imgUrl == '') {
                        Alert.alert("Please provide image for selected option")
                    }
                    else if (QuestionsInitialData[counter].answerType == "Input" && QuestionsInitialData[counter].isImageRequired == true && QuestionsInitialData[counter].imageUrl == null) {
                        Alert.alert("Image Required")
                    }
                    else {


                        if (nestedAnswerFillingDataState.findIndex(x => x.text == QuestionsInitialData[counter].text) < 0) {

                            if (QuestionsInitialData[counter].answerType == "Input") {
                                var dataToSendForAnswerFilling = {
                                    text: QuestionsInitialData[counter].text,
                                    answerType: QuestionsInitialData[counter].answerType,
                                    selectedOptionIndex: selectedOptionId,
                                    answerText: name == null ? selectedOptionIdForDbSend : name,
                                    imagePath: imgUrl
                                }
                            }
                            else {
                                var dataToSendForAnswerFilling = {
                                    text: QuestionsInitialData[counter].text,
                                    answerType: QuestionsInitialData[counter].answerType,
                                    selectedOptionIndex: selectedOptionId,
                                    answerText: name == null ? selectedOptionIdForDbSend : name,
                                    imagePath: imgUrl
                                }
                            }
                            nestedAnswerFillingDataState.push(dataToSendForAnswerFilling);
                        }
                        else {

                            nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).text = QuestionsInitialData[counter].text;
                            nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).answerType = QuestionsInitialData[counter].answerType;
                            nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).answerText = name == null ? selectedOptionIdForDbSend : name;
                            nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).selectedOptionIndex = selectedOptionId;
                            nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).imagePath = imgUrl;
                        }

                        // for (var i = 0, len = nestedAnswerFillingDataState.length; i < len; i++) {
                        //   delete nestedAnswerFillingDataState[i].selectedOptionIndex;
                        // }
                        route.params.setNestedAnswersFromProps(nestedAnswerFillingDataState);
                        navigation.goBack()

                    }
                }


            }
        }
        else {
            var dataToSendForAnswerFilling = {
                text: QuestionsInitialData[counter].text,
                answerType: QuestionsInitialData[counter].answerType,
                selectedOptionIndex: selectedOptionId,
                answerText: name == null ? selectedOptionIdForDbSend : name,
                imagePath: imgUrl
            }
            nestedAnswerFillingDataState.push(dataToSendForAnswerFilling);
            setSelectedOptionId(null)
            setSelectedOptionIdForDbSend(0)
            setImgUrl('')
            setImageSource('')
            setName(null)
            route.params.setNestedAnswersFromProps(nestedAnswerFillingDataState);
            navigation.goBack()

        }
    }

    const getValueFromIncremental = (counter) => {

        getIndex(counter + 1, (selectedIdResponse) => {
            var onPageResult = nestedAnswerFillingDataState.length > 0 && nestedAnswerFillingDataState[counter + 1];
            if (onPageResult) {

                setSelectedId(counter + 1);
                setImgUrl(onPageResult.imagePath ? onPageResult.imagePath : '');
                setSelectedOptionId(onPageResult.selectedOptionIndex)
                setSelectedOptionIdForDbSend(onPageResult.answerText)
                setName(onPageResult.answerText)
                nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).text = QuestionsInitialData[counter].text;
                nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).answerType = QuestionsInitialData[counter].answerType;
                nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).answerText = name == null ? selectedOptionIdForDbSend : name;
                nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).selectedOptionIndex = selectedOptionId;
                nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).imagePath = imgUrl;
            } else {

                if (QuestionsInitialData[counter].answerType == "Input" && QuestionsInitialData[counter].isQuestionRequired && name == null) {
                    Alert.alert("Input required ")
                }
                else if (QuestionsInitialData[counter].answerType == "Dropdown" && QuestionsInitialData[counter].isQuestionRequired && selectedOptionId == null) {
                    Alert.alert("Please select an option")
                }
                else if (QuestionsInitialData[counter].answerType == "Dropdown" && QuestionsInitialData[counter].isQuestionRequired && QuestionsInitialData[counter]?.options[selectedOptionId]?.isImageRequired && imgUrl == '') {
                    Alert.alert("Please provide image for selected option")
                }
                else if (QuestionsInitialData[counter].answerType == "Input" && QuestionsInitialData[counter].isImageRequired == true && QuestionsInitialData[counter].imageUrl == null) {
                    Alert.alert("Image Required")
                }
                else {
                    if (nestedAnswerFillingDataState.length > 0) {
                        setSelectedId(selectedId + 1);
                        if (nestedAnswerFillingDataState.findIndex(x => x.text == QuestionsInitialData[counter].text) < 0) {
                            if (QuestionsInitialData[counter].answerType == "Input") {
                                var dataToSendForAnswerFilling = {
                                    text: QuestionsInitialData[counter].text,
                                    answerType: QuestionsInitialData[counter].answerType,
                                    selectedOptionIndex: selectedOptionId,
                                    answerText: name == null ? selectedOptionIdForDbSend : name,
                                    imagePath: imgUrl
                                }
                            }
                            else {
                                var dataToSendForAnswerFilling = {
                                    text: QuestionsInitialData[counter].text,
                                    answerType: QuestionsInitialData[counter].answerType,
                                    selectedOptionIndex: selectedOptionId,
                                    answerText: name == null ? selectedOptionIdForDbSend : name,
                                    imagePath: imgUrl
                                }
                            }
                            nestedAnswerFillingDataState.push(dataToSendForAnswerFilling);
                        }
                        else {

                            nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).text = QuestionsInitialData[counter].text;
                            nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).answerType = QuestionsInitialData[counter].answerType;
                            nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).answerText = name == null ? selectedOptionIdForDbSend : name;
                            nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).selectedOptionIndex = selectedOptionId;
                            nestedAnswerFillingDataState.find(x => x.text == QuestionsInitialData[counter].text).imagePath = imgUrl;

                        }
                        setSelectedOptionId(null)
                        setSelectedOptionIdForDbSend(0)
                        setImgUrl('')
                        setImageSource('')
                        setName(null)
                        flatListRef.current.scrollToIndex({
                            animated: true,
                            index: counter + 1,
                        });
                    }
                    else {
                        setSelectedId(selectedId + 1);
                        var dataToSendForAnswerFilling = {
                            text: QuestionsInitialData[counter].text,
                            answerType: QuestionsInitialData[counter].answerType,
                            selectedOptionIndex: selectedOptionId,
                            answerText: name == null ? selectedOptionIdForDbSend : name,
                            imagePath: imgUrl
                        }
                        nestedAnswerFillingDataState.push(dataToSendForAnswerFilling);
                        setSelectedOptionId(null)
                        setSelectedOptionIdForDbSend(0)
                        setImgUrl('')
                        setImageSource('')
                        setName(null)
                        flatListRef.current.scrollToIndex({
                            animated: true,
                            index: counter + 1,
                        });

                    }
                }

            }
        })
    }

    const getValueFromDecrement = (counter) => {
        flatListRef.current.scrollToIndex({
            animated: true,
            index: counter - 1,
        });
        setSelectedId(selectedId - 1);
        var onPageResult = nestedAnswerFillingDataState[counter - 1];

        setImgUrl(onPageResult.imagePath ? onPageResult.imagePath : '');
        setSelectedOptionId(onPageResult.selectedOptionIndex)
        setSelectedOptionIdForDbSend(onPageResult.answerText)
        setName(onPageResult.answerText)
    }

    var optionsViewList = [];
    QuestionsInitialData[selectedId]?.options?.map((data, index) => {

        if (data != null) {
            optionsViewList.push(
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.optionContainer}>
                        <RadioButton
                            color="#6d81bf"
                            value={data}
                            status={selectedOptionId == index ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setSelectedOptionId(index)
                                setSelectedOptionIdForDbSend(data.option.name)
                            }}
                        />
                        <Text style={{ fontSize: 16, fontWeight: '400', textTransform: "capitalize" }}>{data.option?.name}</Text>
                    </View>
                </View>
            )
        }
    })



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: constants.colorWhite }}>

            <FlatList
                style={{ flexGrow: 0 }}
                ref={flatListRef}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={QuestionsInitialData}
                focusable={true}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
                renderItem={(item) => HorizontalFlatListRenderItem(item)}
            />

            <View style={{ flex: 1, padding: 20, backgroundColor: '#e6e8f6' }} >
                <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 20, height: 310, elevation: 10,  padding: 5 }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}>

                        <View style={{ padding: 15 }}>
                            <View style={{ marginBottom: 10 }}>
                                <Text numberOfLines={2} style={styles.textStyle}>{QuestionsInitialData[selectedId].text}
                                    {QuestionsInitialData[selectedId]?.isQuestionRequired &&
                                        <Text style={{ fontWeight: '700', fontSize: 16, color: constants.colorPrimary }}>
                                            {" "}*
                                        </Text>}</Text>
                            </View>

                            {optionsViewList.length != 0 ? optionsViewList :
                                <TextInput
                                    style={{ width: "100%", backgroundColor: "white", borderWidth: 0.5, borderColor: constants.colorPrimary, marginTop: 15, borderRadius: 5, paddingLeft: 15, height: 150, textAlignVertical: "top" }}
                                    placeholder="Type here..."
                                    onChangeText={(text) => setName(text)}
                                    value={name}
                                    multiline={true}
                                />}

                        </View>
                        {QuestionsInitialData[selectedId]?.answerType == "Dropdown" &&
                            <View style={{ padding: 10, marginTop: 10 }}>

                                <Text style={{ fontWeight: '700', fontSize: 16, padding: 5 }}>
                                    Image
                                    {QuestionsInitialData[selectedId]?.options[selectedOptionId]?.isImageRequired &&
                                        <Text style={{ fontWeight: '700', fontSize: 16, color: constants.colorPrimary }}>
                                            {" "}*
                                        </Text>}
                                </Text>

                                <TouchableOpacity onPress={() => selectPhotoTapped()}>
                                    {imageLoader ?
                                        <View style={[styles.imageStyle, { justifyContent: 'center' }]}>
                                            <ActivityIndicator animating={imageLoader} size={"large"} />
                                        </View> :
                                        <Image
                                            style={styles.imageStyle}
                                            source={{
                                                uri: JsonServer.imageApiUrl + imgUrl,
                                                cache: 'reload'
                                            }}
                                            key={imageSource}
                                        />
                                    }
                                </TouchableOpacity>
                            </View>}
                    </ScrollView>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: "space-between", padding: 20 }}>
                {selectedId == 0
                    ?
                    <TouchableOpacity disabled={true} style={{ flex: 1, backgroundColor: constants.lightGrayColor, height: 50, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => { }}
                    >
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Previous</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity activeOpacity={0.7} style={{ flex: 1, backgroundColor: constants.colorPrimary, height: 50, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => getValueFromDecrement(selectedId)}
                    >
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Previous</Text>
                    </TouchableOpacity>
                }

                {
                    selectedId === QuestionsInitialData.length - 1 ?
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

export default WOQuestionnaireUpdateNestedOptions

const styles = StyleSheet.create({
    renderContainer: { margin: 10, alignItems: "center", justifyContent: 'center', },
    renderTouchableStyle: { alignItems: "center", justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 25, borderWidth: 1, },
    renderTextStyle: { fontWeight: 'bold', fontSize: 20, },
    textStyle: { fontWeight: 'bold', fontSize: 18, color: constants.blackText },
    imageStyle: {
        height: 180,
        backgroundColor: constants.colorGrey838383,
        margin: 10,
        marginTop: 10,
        borderRadius: 4
    },
    optionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
})