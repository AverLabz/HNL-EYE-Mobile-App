import * as React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Accepted from '../../Components/WOComponents/CMTabComponent/CMAccepted';
import Closed from '../../Components/WOComponents/CMTabComponent/CMClosed';
import Pending from '../../Components/WOComponents/CMTabComponent/CMPending';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';

const CMWOScreen = ({ navigation }) => {
  const layout = useWindowDimensions();

  const { setWOScreenNavigationProps, pendingWoCM, acceptedWoCM, closedWoCM } = React.useContext(DataContext)
  const [index, setIndex] = React.useState(0);
  const [pending, setPending] = React.useState(pendingWoCM.length)
  const [accepted, setAccepted] = React.useState(acceptedWoCM.length)
  const [closed, setClosed] = React.useState(closedWoCM.length)

  React.useEffect(() => {
    setWOScreenNavigationProps(navigation);
  }, []);

  React.useEffect(() => {
    setPending(pendingWoCM.length)
    setAccepted(acceptedWoCM.length)
    setClosed(closedWoCM.length)
  }, [pendingWoCM.length, acceptedWoCM.length, closedWoCM.length])

  const [routes] = React.useState([
    { key: 'pending', title: 'Pending' },
    { key: 'accepted', title: 'Accepted' },
    { key: 'closed', title: 'Closed' }
  ]);

  const renderScene = SceneMap({
    pending: Pending,
    accepted: Accepted,
    closed: Closed
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderLabel={({ route, focused, color }) => (
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color }]}>
            {route.title}
          </Text>
          {route.key === 'pending' && pending > 0 && focused && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {pending}
              </Text>
            </View>
          )}
          {route.key === 'accepted' && accepted > 0 && focused && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {accepted}
              </Text>
            </View>
          )}
          {route.key === 'closed' && closed > 0 && focused && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {closed}
              </Text>
            </View>
          )}
        </View>
      )}
      scrollEnabled={false}
      indicatorStyle={{ backgroundColor: constants.red, height: 5 }}
      style={{ backgroundColor: constants.topTabBackgroundGray }}
      activeColor={constants.red}
      inactiveColor={constants.inActiveTabColor}
    />
  );


  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}

export default CMWOScreen

const styles = StyleSheet.create({
  badgeContainer: {
    backgroundColor: constants.badgeBackground,
    borderRadius: 50,
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: constants.textWhite,
    fontFamily: constants.fontSemiBold,
    fontSize: 11
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  titleText: {
    fontFamily: constants.fontMedium,
    fontSize: 16
  }
})