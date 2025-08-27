import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import constants from '../../constants/constants';
import HomeScreen from '../../Screens/Home/HomeScreen';
import LocationForStartDuty from '../../Components/Attandance/Duty/LocationForStartDuty';
import SuccessScreen from '../../Components/Attandance/Duty/SuccessScreen';
import LocationForEndDuty from '../../Components/Attandance/Duty/LocationForEndDuty';
import CalendarsScreen from '../../Screens/Calendar/CalendarsScreen';
import GoToSiteScreen from '../../Components/Trips Managment/GoToSiteScreen';
import AttendanceDetailScreen from '../../Screens/Calendar/AttendanceDetailScreen';
// import MapsScreen from '../../Components/MapScreens/MapsScreen';
import OverTimeScreen from '../../Screens/OverTime/OverTimeScreen';
import TeamScreen from '../../Components/Attandance/Duty/TeamScreen';
import PMAcceptedWODetailPage from '../../Components/WOComponents/PMAcceptedWODetailPage';
import CMAcceptedWODetailPage from '../../Components/WOComponents/CMAcceptedWODetailPage';
import PMWOQuestionnaireTemplateName from '../../Components/WOComponents/PMWOQuestionnaireScreens/PMWOQuestionnaireTemplateName';
import WOQuestionnaireQuestionsMainPage from '../../Components/WOComponents/PMWOQuestionnaireScreens/PMWOQuestionnaireQuestionsMainPage';
import PMQuestionsWithOptionsScreen from '../../Components/WOComponents/PMWOQuestionnaireScreens/PMQuestionsWithOptionsScreen';
import CMWOQuestionnaireTemplateName from '../../Components/WOComponents/CMWOQuestionnaireScreens/CMWOQuestionnaireTemplateName';
import CMWOQuestionnaireQuestionsMainPage from '../../Components/WOComponents/CMWOQuestionnaireScreens/CMWOQuestionnaireQuestionsMainPage';
import CMQuestionsWithOptionsScreen from '../../Components/WOComponents/CMWOQuestionnaireScreens/CMQuestionsWithOptionsScreen';
import PMAccepted from '../../Components/WOComponents/PMTabComponent/PMAccepted';
// import TripsManagementMapsScreen from '../../Components/MapScreens/TripsManagementMapsScreen';
import PMPending from '../../Components/WOComponents/PMTabComponent/PMPending';
import PMWODetailPage from '../../Components/WOComponents/PMTabComponent/PMWODetailPage';
import WOClosedDetailPage from '../../Components/WOComponents/WOClosedDetailPage';
import TaskTickets from '../../Components/TaskTickets';
import CMWODetailPage from '../../Components/WOComponents/CMTabComponent/CMWODetailPage';
import CMPending from '../../Components/WOComponents/CMTabComponent/CMPending';
import CMAccepted from '../../Components/WOComponents/CMTabComponent/CMAccepted';
import CMClosed from '../../Components/WOComponents/CMTabComponent/CMClosed';
import ManageTeam from '../../Screens/ManageTeam/ManageTeam';
import GetAllUserAttendance from '../../Components/Attandance/Duty/GetAllUserAttendance';
import MarkTeamAttendance from '../../Components/Attandance/Duty/MarkTeamAttendance';
import CheckTeamLocation from '../../Components/Attandance/Duty/CheckTeamLocation';
// import ManagerMapsScreen from '../../Components/MapScreens/ManagerMapsScreen';
import ToCheckScreen from '../../Screens/Home/ToCheckScreen';
// import PathMapsScreen from '../../Components/MapScreens/PathMapsScreen';
import AllTripsScreen from '../../Components/Trips Managment/AllTripsScreen';
import ViewTeamWOs from '../../Screens/ManageTeam/ViewTeamWOs';
import InventoryAssigned from '../../Screens/ManageInventory/InventoryAssigned';
import InventoryAcceptedByEmployee from '../../Screens/ManageInventory/InventoryAcceptedByEmployee';
import ScanBarcode from '../../Screens/ManageInventory/ScanBarcode';
import InventoryPlacedAtSite from '../../Screens/ManageInventory/InventoryPlacedAtSite';
import InventoryReturnToWarehouse from '../../Screens/ManageInventory/InventoryReturnToWarehouse';
import ManagerLocationForStartDuty from '../../Components/Attandance/Duty/ManagerLocationForStartDuty';
import InventoryWarrantyClaim from '../../Screens/ManageInventory/InventoryWarrantyClaim';
import ScanBarcodeForWarrantyClaim from '../../Screens/ManageInventory/ScanBarcodeForWarrantyClaim';
import Edittelcoinventory from '../../Screens/Edit/EditTelcoinventory';
import EditBtscabinet from '../../Screens/Edit/EditBtscabinet';
import EditAntennas from '../../Screens/Edit/EditAntennas';
import EditRrus from '../../Screens/Edit/EditRrus';
import EditIdu from '../../Screens/Edit/EditIdu';
import EditOdu from '../../Screens/Edit/EditOdu';
import EditBtscabinetboard from '../../Screens/Edit/EditBtscabinetboard';
import BtsCabinetVswrs from '../../Screens/Edit/BtsCabinetVswrs';
import IduMmuCards from '../../Screens/Edit/IduMmuCards';
import SerialNumber from '../../Screens/Filters/SerialNumber';
import CaptureImage from '../../Screens/ManageInventory/CaptureImage';
import AcceptFaulty from '../../Screens/ManageInventory/AcceptFaulty';
import Partial from '../../Screens/ManageInventory/Partial';
import AddInventoryToSite from '../../Screens/ManageInventory/AddInventoryToSite';
import CreateFSR from '../../Screens/CreateFSR/CreateFSR';
import AddItemsScreen from '../../Screens/CreateFSR/AddItemsScreen';
import WOQuestionnaireTabs from '../../Components/WOComponents/WOQuestionaireTabs/WOQuestionnaireTabs';
import WOQuestionnaireOptions from '../../Components/WOComponents/WOQuestionaireTabs/WOQuestionnaireOptions';
import WOQuestionnaireUpdateOptions from '../../Components/WOComponents/WOQuestionaireUpdateTabs/WOQuestionnaireUpdateOptions';
import WOQuestionnaireNestedOptions from '../../Components/WOComponents/WOQuestionaireTabs/WOQuestionnaireNestedOptions';
import WOSelectedTabScreen from '../../Components/WOComponents/WOQuestionaireTabs/WOSelectedTabScreen';
import WOQuestionnaireUpdateNestedOptions from '../../Components/WOComponents/WOQuestionaireTabs/WOQuestionnaireUpdateNestedOptions';
import CreateCM from '../../Screens/CreateCM/CreateCM';
import ScanInventory from '../../Screens/ScanInventory/ScanInventory';
import ScanInventoryTabs from '../../Screens/ScanInventory/ScanInventoryTabs';
import AddInventoryQuestionnaire from '../../Screens/ScanInventory/AddInventoryQuestionnaire';
import LoginScreen from '../../Screens/Login/LoginScreen';
import DrawerNavigator from './DrawerNavigator';
import Splash from '../../Screens/Splash/Splash';


const HomeNavigator = (props) => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerMode: 'screen',
        headerStyle: {
          backgroundColor: constants.colorWhite,
          borderBottomWidth: 1,
          borderColor: constants.headerBorderColor
        },
        headerTintColor: constants.blackText,
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 17,
          fontFamily: constants.fontMedium,
          color: constants.blackText,
          lineHeight: 20.72
        },
      }}>

      <Stack.Screen
        options={{
          title: "Splash",
          headerShown: false
        }}
        name="Splash"
        component={Splash}
      />
      <Stack.Screen
        options={{
          title: "Login",
          headerShown: false
        }}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{
          title: "",
          headerShown: false
        }}
        name="DrawerNavigator"
        component={DrawerNavigator}
      />
      <Stack.Screen
        options={{
          title: "Attendance",

        }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: '(Telco Assets)',
          headerShadowVisible: false
        }}
        name="Edittelcoinventory"
        component={Edittelcoinventory}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: '(Telco Assets)',
          headerShadowVisible: false
        }}
        name="EditAntennas"
        component={EditAntennas}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: '(Telco Assets)',
          headerShadowVisible: false
        }}
        name="EditRrus"
        component={EditRrus}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: '(Telco Assets)',
          headerShadowVisible: false
        }}
        name="EditBtscabinetboard"
        component={EditBtscabinetboard}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: '(Telco Assets)',
          headerShadowVisible: false
        }}
        name="EditIdu"
        component={EditIdu}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: '(Telco Assets)',
          headerShadowVisible: false
        }}
        name="EditOdu"
        component={EditOdu}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: '(Telco Assets)',
          headerShadowVisible: false
        }}
        name="BtsCabinetVswrs"
        component={BtsCabinetVswrs}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: '(Telco Assets)',
          headerShadowVisible: false
        }}
        name="EditBtscabinet"
        component={EditBtscabinet}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: '(Telco Assets)',
          headerShadowVisible: false
        }}
        name="IduMmuCards"
        component={IduMmuCards}
      />

      <Stack.Screen
        options={{ headerShown: true, title: 'OverTime' }}
        name="OverTimeScreen"
        component={OverTimeScreen}
      />


      {/* <Stack.Screen
        options={{ headerShown: true, title: 'Maps' }}
        name="MapsScreen"
        component={MapsScreen}
      /> */}
      <Stack.Screen
        options={{ headerShown: true, title: 'Closed Work Order' }}
        name="WOClosedDetailPage"
        component={WOClosedDetailPage}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Attendance Details' }}
        name="AttendanceDetailScreen"
        component={AttendanceDetailScreen}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'WO Details' }}
        name="PMQuestionsWithOptionsScreen"
        component={PMQuestionsWithOptionsScreen}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'WO Details' }}
        name="CMQuestionsWithOptionsScreen"
        component={CMQuestionsWithOptionsScreen}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'PM Pending WOs' }}
        name="PMPending"
        component={PMPending}
      />
      {/* <Stack.Screen
        options={{ headerShown: true, title: 'TripsManagement' }}
        name="TripsManagementMapsScreen"
        component={TripsManagementMapsScreen}
      /> */}

      <Stack.Screen
        options={{ headerShown: true, title: 'Select Site' }}
        name="LocationForStartDuty"
        component={LocationForStartDuty}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Select Site' }}
        name="LocationForEndDuty"
        component={LocationForEndDuty}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'CM Closed WOs' }}
        name="CMClosed"
        component={CMClosed}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'CM Accepted WOs' }}
        name="CMAccepted"
        component={CMAccepted}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'CM Pending WOs' }}
        name="CMPending"
        component={CMPending}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'CM WO Details' }}
        name="CMWODetailPage"
        component={CMWODetailPage}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Select Site' }}
        name="ManagerLocationForStartDuty"
        component={ManagerLocationForStartDuty}
      />

      <Stack.Screen
        options={{ headerShown: true, title: 'TaskTickets' }}
        name="TaskTickets"
        component={TaskTickets}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Select Employee' }}
        name="CheckTeamLocation"
        component={CheckTeamLocation}
      />
      {/* <Stack.Screen
        options={{ headerShown: true, title: 'Track Employee' }}
        name="ManagerMapsScreen"
        component={ManagerMapsScreen}
      /> */}
      <Stack.Screen
        options={{ headerShown: true, title: 'Assigned Inventory' }}
        name="InventoryAssigned"
        component={InventoryAssigned}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Attendance' }}
        name="ToCheckScreen"
        component={ToCheckScreen}
      />
      {/* <Stack.Screen
        options={{ headerShown: true, title: 'Visit Path' }}
        name="PathMapsScreen"
        component={PathMapsScreen}
      /> */}
      <Stack.Screen
        options={{ headerShown: true, title: 'All Trips' }}
        name="AllTripsScreen"
        component={AllTripsScreen}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Team Work Orders' }}
        name="ViewTeamWOs"
        component={ViewTeamWOs}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Accepted' }}
        name="InventoryAcceptedByEmployee"
        component={InventoryAcceptedByEmployee}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Placed' }}
        name="InventoryPlacedAtSite"
        component={InventoryPlacedAtSite}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Return To Warehouse' }}
        name="InventoryReturnToWarehouse"
        component={InventoryReturnToWarehouse}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Scan' }}
        name="ScanBarcode"
        component={ScanBarcode}
      />
      <Stack.Screen
        options={{
          headerLeftContainerStyle: { marginLeft: 15 },
          headerRightContainerStyle: { marginRight: 15 }
        }}
        name="Success"
        component={SuccessScreen}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Calendar' }}
        name="Calendar"
        component={CalendarsScreen}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Team' }}
        name="TeamScreen"
        component={TeamScreen}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Accepted Work Orders' }}
        name="PMAcceptedWODetailPage"
        component={PMAcceptedWODetailPage}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Accepted Work Orders' }}
        name="CMAcceptedWODetailPage"
        component={CMAcceptedWODetailPage}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'PM Accepted WOs' }}
        name="PMAccepted"
        component={PMAccepted}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'PM Checklist' }}
        name="PMWOQuestionnaireTemplateName"
        component={PMWOQuestionnaireTemplateName}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'CM Checklist' }}
        name="CMWOQuestionnaireTemplateName"
        component={CMWOQuestionnaireTemplateName}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'WorkOrderDetails' }}
        name="PMWODetailPage"
        component={PMWODetailPage}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Sites' }}
        name="GoToSiteScreen"
        component={GoToSiteScreen}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Manage Team' }}
        name="ManageTeam"
        component={ManageTeam}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'All User Attendance ' }}
        name="GetAllUserAttendance"
        component={GetAllUserAttendance}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'All Team ' }}
        name="MarkTeamAttendance"
        component={MarkTeamAttendance}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Questionnaire Questions' }}
        name="WOQuestionnaireQuestionsMainPage"
        component={WOQuestionnaireQuestionsMainPage}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'CM Questionnaire Questions' }}
        name="CMWOQuestionnaireQuestionsMainPage"
        component={CMWOQuestionnaireQuestionsMainPage}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Warranty Claim' }}
        name="InventoryWarrantyClaim"
        component={InventoryWarrantyClaim}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Scan Warranty Claim' }}
        name="ScanBarcodeForWarrantyClaim"
        component={ScanBarcodeForWarrantyClaim}
      />

      <Stack.Screen
        options={{ headerShown: true, title: 'Serial Number' }}
        name="SerialNumber"
        component={SerialNumber}
      />
      <Stack.Screen
        options={{ headerShown: true, title: '' }}
        name="CaptureImage"
        component={CaptureImage}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Accept Faulty' }}
        name="AcceptFaulty"
        component={AcceptFaulty}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Partial' }}
        name="Partial"
        component={Partial}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Accept Faulty Inventory' }}
        name="AddInventoryToSite"
        component={AddInventoryToSite}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Create FSR' }}
        name="CreateFSR"
        component={CreateFSR}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Add Item Info' }}
        name="AddItemsScreen"
        component={AddItemsScreen}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Questionnaire Tabs' }}
        name="WOQuestionnaireTabs"
        component={WOQuestionnaireTabs}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Questionnaire Tabs' }}
        name="WOQuestionnaireOptions"
        component={WOQuestionnaireOptions}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Questionnaire Tabs' }}
        name="WOQuestionnaireNestedOptions"
        component={WOQuestionnaireNestedOptions}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Questionnaire Tabs' }}
        name="WOQuestionnaireUpdateOptions"
        component={WOQuestionnaireUpdateOptions}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Questionnaire Tabs' }}
        name="WOSelectedTabScreen"
        component={WOSelectedTabScreen}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Questionnaire Tabs' }}
        name="WOQuestionnaireUpdateNestedOptions"
        component={WOQuestionnaireUpdateNestedOptions}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Create CM' }}
        name="CreateCM"
        component={CreateCM}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Scan Inventory' }}
        name="ScanInventory"
        component={ScanInventory}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Scan Inventory Items' }}
        name="ScanInventoryTabs"
        component={ScanInventoryTabs}
      />
      <Stack.Screen
        options={{ headerShown: true, title: 'Scan Inventory Items' }}
        name="AddInventoryQuestionnaire"
        component={AddInventoryQuestionnaire}
      />
    </Stack.Navigator>
  );
}

export default HomeNavigator;