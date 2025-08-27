import {
  useFocusEffect,
} from '@react-navigation/native';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ImageMarker, { Position } from "react-native-image-marker";
import { launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { DataContext } from '../../../Context/context-provider';
import constants from '../../../constants/constants';

const PMQuestionsWithInputScreen = (param) => {


  const { getCurretLocation, saveToAsyncStoragePMWOQuestionsData, setIsLoadingActivityIncatorForImage, ConvertImageToBase64 } = useContext(DataContext)

  const [currentLongitude, setCurrentLongitude] = useState('');
  const [txtInputText, setTxtInputText] = useState(null);
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [imageSource, setImageSource] = useState(null);
  const [imageUploading, setImageUploading] = useState(null);


  useFocusEffect(() => {
    getCurretLocation((location, success) => {
      if (success) {
        setCurrentLatitude(location.coords.latitude);
        setCurrentLongitude(location.coords.longitude);
      }
      else {
        Alert.alert(
          "Please turn on your location",
          "Allow HNL to access Your current location",
          [
            {
              text: "Cancel",
              onPress: () => param.navigation.goBack(),
              style: "cancel"
            },
            { text: "OK", onPress: () => Linking.openSettings() }
          ]
        );
      }
    });

    setImageSource(param.QuestionsInitialData.find(x => x.id == param.questionScreenData.answerTypeId).imageUrl);
    setTxtInputText(param.QuestionsInitialData.find(x => x.id == param.questionScreenData.answerTypeId).answerText)

  })

  // const selectPhotoTapped = async () => {
  //  
  //   if (currentLongitude == "") {
  //     Alert.alert("Please share your location");
  //     param.navigation.goBack();
  //   }
  //   else {
  //     try {
  //       await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.CAMERA,
  //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       ]);
  //       if (
  //         (await PermissionsAndroid.check('android.permission.CAMERA')) &&
  //         (await PermissionsAndroid.check('android.permission.CAMERA')) &&
  //         (await PermissionsAndroid.check('android.permission.CAMERA'))
  //       ) {
  //         try {
  //           const granted = await PermissionsAndroid.request(
  //             PermissionsAndroid.PERMISSIONS.CAMERA,
  //             {
  //               title: 'HNL App Camera Permission',
  //               message:
  //                 'HNL needs access to your camera ' +
  //                 'so you can take awesome pictures.',
  //               buttonNeutral: 'Ask Me Later',
  //               buttonNegative: 'Cancel',
  //               buttonPositive: 'OK',
  //             },
  //           );
  //           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //             var options = {
  //               title: 'Select Profile Image',
  //               cancelButtonTitle: 'Cancel',
  //               takePhotoButtonTitle: 'Take Photo...',
  //               chooseFromLibraryButtonTitle: 'Choose from Library...',
  //               chooseFromLibraryButtonHidden: false,
  //               noData: false, // we use response.data to display gif
  //               allowsEditing: false, // make sure we don't edit the gif
  //             };
  //            
  //             launchCamera(options, response => {
  //               if (response.didCancel) {
  //                 console.log('User cancelled image picker');
  //               } else if (response.error) {
  //                 console.log('ImagePicker Error: ', response.error);
  //                 console.log(response);
  //               } else if (response.customButton) {
  //                 console.log(
  //                   'User tapped custom button: ',
  //                   response.customButton,
  //                 );
  //               } else {
  //                 ImageResizer.createResizedImage(
  //                   response.assets[0].uri,
  //                   700,
  //                   500,
  //                   'PNG',
  //                   100,
  //                 )
  //                   .then(({ uri }) => {
  //                     const source = { uri: response.assets[0].uri };
  //                     // setIsLoadingActivityIncatorForImage(true)
  //                     ConvertImageToBase64(uri, (result) => {
  //                       setImageSource(result)
  //                       param.QuestionsInitialData.find(x => x.id == param.questionScreenData.answerTypeId).imageUrl = result;
  //                       param.questionsDatoFromAsyncfromAsyncStorage.find(x => x.WO == param.WOId).Data.questionTemplates.find(x => x.id == param.wOQuestionnaireQuestionsMainPageItemData.id).
  //                         questions.find(x => x.id == param.questionScreenData.answerTypeId).imageUrl = result;
  //                       saveToAsyncStoragePMWOQuestionsData(param.questionsDatoFromAsyncfromAsyncStorage);
  //                       setIsLoadingActivityIncatorForImage(false)
  //                     })

  //                   })
  //                   .catch(err => {
  //                     console.log(err);
  //                     setIsLoadingActivityIncatorForImage(false)
  //                     return Alert.alert(
  //                       'Unable to resize the photo',
  //                       'Check the console for full the error message',
  //                     );
  //                   });
  //               }
  //             });
  //           } else {
  //             console.log('Camera permission denied');
  //           }
  //         } catch (err) {
  //           console.warn(err);
  //         }
  //         return true;
  //       } else {
  //         console.log('all permissions denied');
  //         return false;
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }

  // }
  const selectPhotoTapped = async () => {

    if (currentLongitude == "") {
      Alert.alert("Please Turn On your location");
      param.navigation.goBack();
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
                        const source = { uri: res };
                        // setIsLoadingActivityIncatorForImage(true)
                        ConvertImageToBase64(uri, (result) => {

                          setImageSource(result)
                          param.QuestionsInitialData.find(x => x.id == param.questionScreenData.answerTypeId).imageUrl = result;
                          param.questionsDatoFromAsyncfromAsyncStorage.find(x => x.WO == param.WOId).Data.questionTemplates.find(x => x.id == param.wOQuestionnaireQuestionsMainPageItemData.id).
                            questions.find(x => x.id == param.questionScreenData.answerTypeId).imageUrl = result;
                          saveToAsyncStoragePMWOQuestionsData(param.questionsDatoFromAsyncfromAsyncStorage);
                          setIsLoadingActivityIncatorForImage(false)
                        })

                      })
                      .catch(err => {
                        console.log(err);
                        setIsLoadingActivityIncatorForImage(false)
                        return Alert.alert(
                          'Unable to resize the photo',
                          'Check the console for full the error message',
                        );
                      });
                    console.log("the path is" + res)
                  }).catch((err) => {
                    console.log(err)
                    this.setState({
                      loading: false,
                      err
                    })
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


  const setQuestionAnswer = (text) => {
    param.QuestionsInitialData.find(x => x.id == param.questionScreenData.answerTypeId).answerText = text;
    param.questionsDatoFromAsyncfromAsyncStorage.find(x => x.WO == param.WOId).Data.questionTemplates.find(x => x.id == param.wOQuestionnaireQuestionsMainPageItemData.id).questions.find(x => x.id == param.questionScreenData.answerTypeId).answerText = text;
    saveToAsyncStoragePMWOQuestionsData(param.questionsDatoFromAsyncfromAsyncStorage);
    setTxtInputText(text);
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#e6e8f6' }} >
      <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 20, height: 310, elevation: 10,  padding: 5 }}>
        <ScrollView >

          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: '700', fontSize: 16, padding: 5 }}>
              {param.questionScreenData.question + " "}
              {param.questionScreenData.isRequired == true && <Text style={{ fontWeight: '700', fontSize: 16, color: constants.colorPrimary }}>
                *
              </Text>}
            </Text>

            <TextInput
              style={[styles.input, { borderWidth: 1, borderRadius: 10, borderColor: constants.colorPrimary, textAlignVertical: 'top', height: 100, marginTop: 10 }]}
              multiline={true}
              value={txtInputText}
              underlineColorAndroid="transparent"
              onChangeText={(text) => setQuestionAnswer(text)}
            />
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: '700', fontSize: 16, padding: 5 }}>
                Image
                {param.questionScreenData.isImageRequired == true && <Text style={{ fontWeight: '700', fontSize: 16, color: constants.colorPrimary }}>
                  *
                </Text>}
              </Text>

              <TouchableOpacity onPress={() => selectPhotoTapped()}>
                <Image
                  style={{
                    height: 190,
                    backgroundColor: constants.colorGrey838383,
                    margin: 20,
                    marginTop: 10,
                  }}
                  source={{
                    uri: 'data:image/png;base64,' + imageSource,
                  }}
                  key={imageSource}
                />
              </TouchableOpacity>
            </View>


          </View>
        </ScrollView>
      </View>
    </View>

  );
}
export default PMQuestionsWithInputScreen;
// define your styles
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'black'
  },
  textfont: {

    marginLeft: 25
  },
  outerView: {
    flexDirection: 'row',

  },
  innerView: {
    flex: 1,
    backgroundColor: 'white',
    height: 160,
    borderRadius: 15,
    justifyContent: 'center',
    //alignItems: 'center',

  },
  homeIcon: {
    alignItems: 'center',
    height: 75,
    width: 75,
    marginBottom: 15,
    marginLeft: 20

  },
  bodyIcon: {
    alignItems: 'center',
    height: 80,
    width: 25,
    marginBottom: 15,
    marginLeft: 30

  },
  textButton: {
    width: 160,
    padding: 10,
    fontSize: 20,
    marginLeft: 20,
    borderRadius: 30,
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#6d81bf',

  },
  viewButton: {
    flex: 1,
    // alignItems: 'center',
    paddingTop: 20,
    flexDirection: 'row'
  }
})