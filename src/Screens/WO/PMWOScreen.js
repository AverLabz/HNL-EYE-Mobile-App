import * as React from 'react';
import { useWindowDimensions, View, Text, StyleSheet } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import PMAccepted from '../../Components/WOComponents/PMTabComponent/PMAccepted';
import PMClosed from '../../Components/WOComponents/PMTabComponent/PMClosed';
import PMPending from '../../Components/WOComponents/PMTabComponent/PMPending';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';

const PMWOScreen = ({ route, navigation }) => {
  const layout = useWindowDimensions();

  const { setWOScreenNavigationProps, pendingWoPM, acceptedWoPM, closedWoPM } = React.useContext(DataContext)
  const [index, setIndex] = React.useState(0);
  const [pending, setPending] = React.useState(pendingWoPM.length)
  const [accepted, setAccepted] = React.useState(acceptedWoPM.length)
  const [closed, setClosed] = React.useState(closedWoPM.length)

  React.useEffect(() => {
    setWOScreenNavigationProps(navigation);
  }, []);

  React.useEffect(() => {
    setPending(pendingWoPM.length)
    setAccepted(acceptedWoPM.length)
    setClosed(closedWoPM.length)
  }, [pendingWoPM.length, acceptedWoPM.length, closedWoPM.length])

  const [routes] = React.useState([
    { key: 'pending', title: 'Pending' },
    { key: 'accepted', title: 'Accepted' },
    { key: 'closed', title: 'Closed' }
  ]);

  const renderScene = SceneMap({
    pending: PMPending,
    accepted: PMAccepted,
    closed: PMClosed,
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

export default PMWOScreen;

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
