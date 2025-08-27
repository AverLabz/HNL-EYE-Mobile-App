import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  processColor,
} from 'react-native';
import { PieChart } from 'react-native-charts-wrapper';
import constants from '../constants/constants';

const HalfPieChart = ({ workOrder, data, onSelect }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
  const highlights = [{ x: 0 }]
  const legend = {
    enabled: false,
    textSize: 18,
    form: 'LINE',
    horizontalAlignment: "LEFT",
    verticalAlignment: "TOP",
    orientation: "HORIZONTAL",
    wordWrapEnabled: false
  };

  const handleSelect = (event) => {
    let entry = event.nativeEvent
    onSelect(event);
  };

  const description = {
    text: '',
    textSize: 15,
    textColor: processColor('transparent'),
  };

  const DataItems = (value, label, color) => {
    return (
      <View style={styles.leftSubContainer}>
        <View style={{ height: 12, width: 12, marginRight: 6, backgroundColor: color, borderRadius: 50, marginTop: 2 }} />
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', marginBottom: 5 }}>
          <Text style={styles.workOrderTitleText}>{value}</Text>
          <Text style={[styles.workOrderText, { color }]}>{label} days</Text>
        </View>
      </View>
    )
  }
  const deStructure = data?.dataSets[0].values

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.headingText}>Total Attendance of this Month</Text>
        <TouchableOpacity activeOpacity={1} style={styles.monthContainer}>
          <Text style={styles.monthText}>{currentMonthName}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.leftContainer}>
          {DataItems('Present', deStructure[2].value, '#67B700')}
          {DataItems('Leaves', deStructure[1].value, '#F38200')}
          {DataItems('Absent', deStructure[0].value, '#D40101')}
        </View>
        <PieChart
          style={styles.chart}
          logEnabled={true}
          chartBackgroundColor={processColor('#F2F2F2')}
          chartDescription={description}
          data={data}
          legend={legend}
          highlights={highlights}
          extraOffsets={{ left: -110, top: 0, right: -110, bottom: -110 }}
          entryLabelColor={processColor('green')}
          entryLabelFontFamily={constants.fontMedium}
          drawEntryLabels={false}
          rotationEnabled={true}
          rotationAngle={180}
          usePercentValues={false}
          styledCenterText={{ text: '', color: processColor(constants.defaultTextBlack), fontFamily: constants.fontMedium, size: 14 }}
          centerTextRadiusPercent={0}
          holeRadius={60}
          holeColor={processColor('#F2F2F2')}
          transparentCircleRadius={60}
          transparentCircleColor={processColor('#F2F2F2')}
          maxAngle={180}
          onSelect={handleSelect}
          onChange={(event) => console.log(event.nativeEvent)}
          dragDecelerationEnabled={false} // Disable dragging
          dragDecelerationFrictionCoef={0}
          touchEnabled={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    marginTop: 20,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    gap: 15
  },
  chartContainer: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 4
  },
  leftSubContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  monthContainer: {
    paddingHorizontal: 10,
    borderRadius: 4,
    paddingVertical: 3,
    backgroundColor: constants.monthBackgroundOrange,
  },
  chart: {
    height: 110,
    width: 222
  },
  monthText: {
    fontSize: 14,
    fontFamily: constants.fontBold,
    color: constants.textWhite,
    lineHeight: 17.07,
  },
  workOrderText: {
    fontSize: 12,
    fontFamily: constants.fontBold,
    color: constants.defaultTextBlack,
    lineHeight: 14.63,
    letterSpacing: 0.5
  },
  workOrderTitleText: {
    fontSize: 12,
    fontFamily: constants.fontMedium,
    color: constants.defaultTextBlack,
    lineHeight: 14.63,
  },
  fontRegular: {
    fontFamily: constants.fontRegular,
  },
  headingText: {
    fontSize: 14,
    fontFamily: constants.fontMedium,
    color: constants.defaultTextBlack,
    lineHeight: 17.07,
  }
});

export default HalfPieChart;
