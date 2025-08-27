import { StyleSheet } from 'react-native';
import constants from '../constants/constants';

const styles = StyleSheet.create({
  //Main ScreenStyle
  transparentInputBox: {
    flexDirection: 'row',
    backgroundColor: constants.colorGrey838383,
    borderWidth: 1,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 5,
    opacity: 0.8,
    borderColor: constants.colorPrimary,
    borderRadius: 7,
    color: 'black',
  },
  headerRightTextStyle: {
    color: 'white', fontSize: 16, fontWeight: 'bold'
  },
  transparentInputBoxapply: {
    flexDirection: 'row',
    backgroundColor: constants.colorGrey838383,
    borderWidth: 1,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 5,
    opacity: 0.8,
    borderColor: 'grey',
    borderRadius: 7,
    color: 'black',
    height: 100,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#F55145',
  },
  profileSection: {

  },
  ImageBackgroundProfile: {
    height: 200,
    justifyContent: 'center'
  },
  Avator: {
    flexDirection: 'column',
  },
  Avatorname: {
    color: 'black', fontWeight: 'bold',
    //  marginLeft:10,
    //  paddingLef:,
  },
  AvatorerpId: {
    color: 'black', fontWeight: 'bold',
    // justifyContent: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    // textAlignVertical: "center",
    // alignSelf : "center",
    marginLeft: 10,
    paddingLeft: 8,
  },
  Avatormail: {
    color: 'black', padding: 5,
  },
  switchButtonsText: {
    padding: 10,
  },
  textfont: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold'
  },
  userInfoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tinyLogo: {
    width: 60,
    height: 80,
  },
  drawersection: {
    backgroundColor: constants.colorWhite, flexDirection: 'column', flex: 3,
  },
  draweritem: {
    // backgroundColor:'#e9cac7',
    // height: 50,
    //  width:50 
    padding: 12, flexDirection: 'row',
  },
  workitem: {
    padding: 14, flex: 1, borderRadius: 10, backgroundColor: 'red'
  },
  icon: {
    width: 5,
  },
  item: {
    padding: 10,
    fontSize: 12,
  },
  itemtext: {
    flex: 1, paddingLeft: 10, justifyContent: 'center',
  },
  itemname: {
    fontSize: 12,
  },
  bottomDrawerSection: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    marginTop: 20,
    paddingVertical: 60
  },
  bottomDrawerSetting: {
    padding: 10, flexDirection: 'row',
  },
  bottomDrawerLogout: {
    flexDirection: 'row', paddingLeft: 11,
  },
  spinnerTextStyle: {
    fontSize: 12,
    color: 'black',
  },
  dropdown_2: {
    height: 45,
    marginTop: 8,
    margin: 20,
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  circularView: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: constants.colorGrey838383,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyleQuestionnare: { height: 150, backgroundColor: constants.colorGrey838383, margin: 20, marginTop: 10 },
  questionTextStyleQuestionnare: { color: constants.colorWhite, padding: 7, borderRadius: 6, fontSize: 14, fontWeight: '400', backgroundColor: constants.colorMainBg },
  circularViewSelected: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: constants.colorMainBg,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth:5,
    // borderColor:constants.coloYellowFFFF00
  },
  dropdown_2_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 12,
    color: 'white',
  },
  VideosListingCellImage: {
    flex: 1,
  },
  dropdown_2_dropdown: {
    width: 200,
    height: 120,
    borderColor: constants.colorMainBg,
    borderWidth: 2,
    borderRadius: 3,
  },
  transparentView: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 15,
  },
  tabsContainerStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    opacity: 0.8,
    borderColor: 'grey',
    borderRadius: 7,
    height: 45,
    color: 'black',
  },
  transparentInputBoxTextArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    opacity: 0.8,
    borderColor: 'grey',
    borderRadius: 7,
    height: 80,
  },
  transparentInputBox1: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 40,
    opacity: 0.8,
    borderColor: constants.colorPurpleDark302757,
    borderRadius: 7,
    height: 50,
  },
  transparentInputMultiLineBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    opacity: 0.8,
    borderColor: 'grey',
    borderRadius: 7,
    height: 80,
  },
  upperHeader: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
    // justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },

  searchIcon: {
    padding: 10,
  },
  input: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    color: 'black',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
  LeaveInput: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    color: 'black',
    fontWeight: '500',
    fontSize: 14,
    // textAlign:'center'
  },
  inputNotCenterAligned: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 10,
    color: constants.colorBlack,
    fontWeight: '700',
    fontSize: 12,
  },
  inputNotCenterAlignedSignin: {
    // flex: 1,
    // paddingRight: 10,
    // paddingLeft: 10,
    color: constants.colorBlack,
    fontWeight: '700',
    fontSize: 12,
  },
  underline: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontSize: 16,
    color: '#9d0000',
  },
  mainImageBackground: {
    flex: 1,
  },
  mainImageBackgroundSignin: {
    flex: 1,
    // justifyContent: 'center',
  },
  selected: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: constants.colorPurpleDark302757,
    borderBottomColor: '#D1D1D6',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectedText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  unSelectedText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  colonFront: {
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: constants.colorlightf2f2f2,
    borderBottomColor: '#D1D1D6',
    justifyContent: 'center',
  },
  rowFront11: {
    flexDirection: 'row',
    padding: 20,
    // flex:1,
    backgroundColor: constants.colorWhitefcfcfc,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6',

    overflow: 'hidden',
  },
  rowFrontforTimePicker: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 20,
    borderBottomColor: '#D1D1D6',
    overflow: 'hidden',
  },
  rowFront: {
    flexDirection: 'row',
    padding: 20,
    flex: 1,
    borderBottomColor: '#D1D1D6',
    height: 70,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  listItem: {
    padding: 10,
    borderColor: constants.colorPrimary,
    borderWidth: 1,
    borderRadius: 10,
    margin: 2,
  },
  orderDetailTitleText: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 12,
    color: 'white',
    fontWeight: '700',
  },
  orderDetailTitleCell: {
    backgroundColor: constants.colorMainBg,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderDetailTitle: {
    backgroundColor: constants.colorMainBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderDetailTitleBlack: {
    padding: 12,
    fontSize: 14,
    fontFamily: constants.FontFamilyRegular,
    color: 'black',
  },
  // listItem: {
  //     fontSize: 12,
  //     color: 'grey',
  //     fontFamily:constants.FontFamilyRegular
  // },
  listItemBold: {
    fontSize: 12,
    color: 'grey',
    fontFamily: constants.FontFamilyBold,
  },
  listItemGrey: {
    fontSize: 14,
    color: 'grey',
    fontFamily: constants.FontFamilyBold,
  },

  flatlistItemTextBoldRed: {
    flex: 1,
    color: constants.colorMainBg,
    fontSize: 14,
    fontWeight: '400',
  },
  flatlistItemText: {
    color: constants.colorGrey838383,
    fontSize: 12,
  },
  rowColFront: {
    padding: 15,
    flex: 1,
    backgroundColor: constants.colorDarkb7b5bf,
    borderBottomColor: '#D1D1D6',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  rowFront2: {
    flexDirection: 'row',
    paddingRight: 20,
    paddingLeft: 20,
    flex: 1,
    backgroundColor: constants.colorWhitefcfcfc,
    borderBottomColor: '#D1D1D6',
    overflow: 'hidden',
    justifyContent: 'center',
    height: 70,
  },
  rowFront3: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
    paddingTop: 20,
    flex: 2.2,
    backgroundColor: constants.colorWhitefcfcfc,
    borderBottomColor: '#D1D1D6',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  HeaderTextTitleSemiBold: {
    paddingLeft: 5,
    paddingRight: 5,
    color: 'black',
    fontSize: 12,
  },
  HeaderTextTitleSemiBoldStartDuty: {
    paddingLeft: 5,
    color: 'black',
    fontSize: 14,
  },
  homeupperside: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "flex-end",
    bottom: 0,
  },
  homeStartdutyFromBtn: {
    borderRadius: 7,
    backgroundColor: constants.colorPrimary,
    height: 50,
    justifyContent: "center",
    padding: 10,
    marginRight: 20,
  },
  homeLastAttendance: {
    color: "black", fontWeight: "bold", marginLeft: 20,
  },
  homeStartEndDutyBox: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  homeStartEndInsideMargin: {
    marginRight: 10, flex: 1
  },
  homeStartDutyText: {
    color: "black", fontWeight: "bold"
  },
  homeStartEndText: {
    color: "black", fontWeight: "bold", marginTop: 5
  },
  homeStartDutyDate: {
    color: "black", fontWeight: "bold"
  },
  homeEndDutyDate: {
    color: "black", fontWeight: "bold", marginTop: 5
  },
  homeBottomSide: {
    flex: 0.2,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    bottom: 10,
  },
  homeManageTeamBtnTopMargin: {
    borderRadius: 7,
    backgroundColor: constants.colorPrimary,
    height: 50,
    justifyContent: "center",
    padding: 10,
    marginRight: 20,
  },
  leaveHistoryTextHeader: {
    color: 'white',
    fontSize: 12,
  },
  leaveHistoryTextHeaderLeft: {
    color: 'white',
    fontSize: 12,
  },
  NotificationTextTitleSemiBold: {
    paddingLeft: 5,
    paddingRight: 5,
    color: 'red',
    fontSize: 14,
  },
  subNotificationTextTitleSemiBold: {
    paddingLeft: 5,
    paddingRight: 5,
    color: 'blue',
    fontSize: 14,
  },
  footerButtonActive: {
    flexDirection: 'column',
    backgroundColor: constants.ActiveTabcolor,
    flex: 1,
    paddingTop: 15,
    paddingBottom: 25,
  },
  footerButtonInactive: {
    backgroundColor: constants.InActiveTabcolor,
    flexDirection: 'column',
    flex: 1,
    padding: 15,
    alignItems: 'center'
  },
  footerView: {
    backgroundColor: constants.colorMainBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  footerButtonInactiveWithwidth: {
    backgroundColor: constants.InActiveTabcolor,
    flexDirection: 'column',
    flex: 1,
    paddingTop: 15,
    paddingBottom: 25,
    width: 45,
  },
  footerButton2: {
    backgroundColor: constants.colorPurpleLight595278,
    paddingTop: 30,
    paddingBottom: 30,
  },
  //    Signin Screen
  SigninMainView: {
    flex: 6,
    // paddingTop:4
  },
  LoginButton: {
    margin: 18,
    borderRadius: 7,
    backgroundColor: constants.colorPrimary,
    height: 40,
    // flexDirection:'row',
    justifyContent: 'center',
    // alignItems:'center',
    // padding:20
  },
  // Dashboard Screen
  DashboardMainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  MainView: {
    flex: 1,
  },
  DateTextInput: {
    flex: 1,
  },
  StartDutyButton: {
    top: 15,
    borderRadius: 7,
    backgroundColor: constants.colorRed9d0000,
    marginRight: 20,
    marginLeft: 20,
  },
  toCheckStartDutyButton: {
    top: 15,
    borderRadius: 7,
    backgroundColor: constants.colorRed9d0000,
    marginRight: 20,
    marginLeft: 20,
    padding: 12
  },
  // ForgotPassword
  ForgotPasswordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ForgotText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '400',
  },
  ResetButton: {
    margin: 18,
    borderRadius: 7,
    backgroundColor: constants.colorPrimary,
    height: 40,
  },
  // Report Screen
  SelectionTab: {
    backgroundColor: '#595278',
    flexDirection: 'row',
  },
  SelectByWeek: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: constants.ActiveTabcolor,
  },
  SelecByMonth: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: constants.InActiveTabcolor,
    opacity: 1,
  },
  SelectByYear: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: constants.InActiveTabcolor,
    opacity: 1,
  },
  SelectionTextColor: {
    color: constants.colorWhitefcfcfc,
  },

  PickerTab: {
    flexDirection: 'row',
    backgroundColor: '#fe6867',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ReportScrollView: {
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.5,
    marginBottom: 30,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
  },

  HoursContainerView: {
    flex: 1,
    justifyContent: 'center',
  },
  HoursInnerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  HoursView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  ChangePasswordButton: {
    margin: 18,
    borderRadius: 7,
    backgroundColor: constants.ChangePasswordButtonColor,
    height: 40,
  },
  //    Select Month Screen
  MonthListContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    opacity: 0.5,
    marginBottom: 50,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
  },
  // Select Week
  ListContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    opacity: 0.5,
    marginBottom: 50,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
  },

  // Notification
  NotificationContainer1: {
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.5,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
  },
  ToggleSwicthContainer: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  //    Success Screen
  SuccessContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: constants.colorPrimary,
    opacity: 0.6,
    marginBottom: 100,
    marginTop: 80,
    marginLeft: 40,
    marginRight: 40,
  },
  SuccessImage: {
    marginBottom: 50,
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'center',
  },
  SuccessText: {
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  SuccessMain: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    bottom: 10,
    marginTop: 20
  },
  SuccessButtonEndFrom: {
    borderRadius: 7,
    backgroundColor: constants.colorPrimary,
    height: 50,
    justifyContent: 'center',
    padding: 10,
    marginRight: 20,
  },
  SuccessStrtRecordText: {
    textAlign: 'center', color: 'black'
  },
  SuccessButtonManageTeam: {
    borderRadius: 7,
    backgroundColor: constants.colorPrimary,
    height: 50,
    justifyContent: 'center',
    padding: 10,
    marginRight: 20,
  },
  // Start Duty
  DutyTime: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: 20,
    paddingTop: 20,
    flexDirection: 'row',
  },
  ButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  StartBreakButton: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 5,
    marginLeft: 20,
    borderRadius: 7,
    backgroundColor: constants.StartBreakButtonColor,
    height: 45,
  },
  EndDutyButton: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 20,
    borderRadius: 7,
    backgroundColor: constants.colorPrimary,
    height: 45,
  },
  // Footer
  FooterImageSize: {
    width: 20,
    height: 20,
  },
  // CLient Screen
  mapStyle: {
    flex: 0.9,
    position: 'relative',
  },
  redSmallButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    top: 10,
  },
  redSmallButton: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 7,
    backgroundColor: constants.colorPrimary,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ///

  pageContainer: {
    padding: 10,
    flex: 1,
  },
  searchInputs: {
    flexDirection: 'row',
    borderColor: constants.red,
    // borderBottomWidth: 2,

  },
  search: {
    flex: 1,
    marginBottom: 20,
    // borderColor:'#D44744',
    borderColor: constants.colorPrimary,
    borderBottomWidth: 3,
    padding: 10,
    fontFamily: constants.fontMedium,
    fontSize:14
  },

  listItem: {
    padding: 10,
    borderColor: '#f4cfce',
    borderWidth: 1,
    borderRadius: 10,
    margin: 2,
  },
  buttonTextSmall: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonTextSmallLogin: {
    color: constants.colorRed9d0000,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  flatlistItemTextBold: {
    color: 'black',
    fontSize: 14,
    fontWeight: '400',
  },
  flatlistItemText: {
    color: constants.colorGrey838383,
    fontSize: 12,
  },
  info: {
    padding: 10,
    marginTop: 20,
    borderColor: '#f4cfce',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#f4cfce',
  },
  row1: {
    flexDirection: 'row',
  },
  prop: {
    flex: 1,
    padding: 10,
  },
  val: {
    borderLeftWidth: 1,
    alignSelf: 'center',
    flex: 2,
  },
  // CalanderToTrackScreen
  calanderToTracScreenScrollView: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: 'transparent'
  },
  calanderToTracScreenPickDate: {
    marginTop: 20, marginLeft: 20,
    fontSize: 14, color: 'black', fontWeight: '700'
  },
  calanderToTracScreenCalender: {
    borderBottomWidth: 2,
    borderBottomColor: constants.colorlightf2f2f2,
    height: 5, margin: 20
  },
  marginTop10: {
    marginTop: 10,
  },
  marginTop20: {
    marginTop: 20,
  },
  adminNotStrtJrny: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center'
  },
  // TrackWorkOrders
  TrackWorkOrderSegmentedControlTabUpper: {
    flexDirection: 'column',
    marginBottom: 15,
    paddingBottom: 20,
    paddingRight: 20,
    marginTop: 20,
  },
  tabsContainerStyle: {
    borderColor: constants.appBackgroundColor,
    borderRadius: 20,
    marginLeft: 15,
  },
  tabStyle: {
    height: 45,
    borderColor: 'red',
  },
  tabTextStyle: {
    color: constants.colorMainBg,
    fontFamily: constants.FontFamilyBold,
  },
  activeTabStyle: {
    backgroundColor: constants.appBackgroundColor
  },
  //  activeTabTextStyle:{
  //   colorWhite: constants.colorWhite,
  // },
  inputIOS: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginRight: 20,
    marginLeft: 20,
    opacity: 0.8,
    borderColor: 'grey',
    borderRadius: 7,
    height: 45,
    fontSize: 14,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginTop: 20,
  },
  inputAndroid: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 20,
    opacity: 0.8,
    borderColor: 'grey',
    borderRadius: 7,
    height: 45,
    fontSize: 14,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  // LeaveHistory
  LeaveHistoryMain: {
    flex: 1,
    flexDirection: 'row'
  },
  LeaveHistoryItemDate: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  LeaveHistoryItemStatus: {
    flex: 2.2, alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  LeaveHistoryItemDisease: {
    flex: 2, alignItems: 'center', justifyContent: 'center'
  },
  LeaveHistoryItemDelete: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ChangePassword
  ChangePasswordMain: {
    flex: 1, alignItems: 'center', justifyContent: 'center'
  },
  ChangePasswordButtonUpdate: {
    margin: 18, borderRadius: 7, backgroundColor: constants.ChangePasswordButtonColor, height: 40
  },
  // ApplyLeaveScreen
  ApplyLeaveMain: {
    marginTop: 20,
    alignItems: 'flex-end',
    bottom: 10,
  },
  ApplyLeaveButtonOldLeaves: {
    borderRadius: 7,
    backgroundColor: constants.colorPrimary,
    height: 50,
    justifyContent: 'center',
    padding: 10,
    marginRight: 20,
  },
  ApplyLeaveButtonChooseReasonText: {
    color: 'darkred', fontWeight: 'bold', fontSize: 16, marginLeft: 23
  },
  ApplyLeaveButtonSubmit: {
    margin: 18, borderRadius: 7,
    backgroundColor: constants.ChangePasswordButtonColor,
    height: 40
  },
  ApplyLeaveDetails: {
    justifyContent: "flex-start",
    textAlignVertical: 'top'
  },
  // LeaveScreen
  LeaveScreenMain: {
    flex: 0.2, paddingTop: 10, marginRight: 20
  },
  LeaveScreenButtonOldLeave: {
    alignItems: 'flex-end', marginRight: 20
  },
  LeaveScreenButtonOldLeaveInside: {
    width: 150, justifyContent: 'center', borderRadius: 10, backgroundColor: constants.OldLeavesButtonColor
  },
  LeaveScreenButtonOldLeaveText: {
    color: 'white', fontSize: 14, paddingBottom: 5, paddingTop: 5
  },
  LeaveScreenButtonSubmit: {
    marginRight: 20, borderRadius: 7, backgroundColor: constants.colorPrimary, height: 40
  },

  // LogsScreen  LogDataToTrack
  LogDataFlatList: {
    flex: 1,
    flexDirection: 'row'
  },
  LogDataTime: {
    flex: 1,
    flexDirection: 'column'
  },
  LogDataLocation: {
    flex: 1, flexDirection: 'column',
    alignItems: 'flex-end'
  },
  LogDataLatLong: {
    flex: 1, textAlign: 'right'
  },
  LogDataMain: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 30,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
    borderTopWidth: 1,
    borderTopColor: constants.colorBlack,
    borderLeftWidth: 1,
    borderLeftColor: constants.colorBlack,
  },
  LogDataMainInner: {
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: constants.colorWhite,
  },
  LogDataMainBg: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: constants.colorMainBg,
  }, panelButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: constants.colorWhite,
  },
  panelButton: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: constants.colorPrimary,
    alignItems: 'center',
    marginVertical: 10
  },
  ViewStyle: {
    marginVertical: 10,
    paddingHorizontal: 10

  },
  panel: {
    paddingHorizontal: 10
  },
  modelStyle: {
    margin: 0
  },
  closeButtonStyle: { backgroundColor: constants.colorPrimary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100, margin: 10 },

});
export default styles;
