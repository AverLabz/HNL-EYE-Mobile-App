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

const WorkOrderPieChart = ({ workOrder, data, onSelect }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
  const highlights = [{ x: 0 }]
  const legend = {
    enabled: false,
    textSize: 18,
    form: 'CIRCLE',
    horizontalAlignment: "RIGHT",
    verticalAlignment: "CENTER",
    orientation: "VERTICAL",
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
        <View style={{ height: 8, width: 22, marginRight: 6, backgroundColor: color }} />
        <Text style={styles.workOrderText}>{value}{' '}<Text style={styles.fontRegular}>{label}</Text></Text>
      </View>
    )
  }
  const deStructure = data?.dataSets[0].values

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.headingText}>{workOrder}(Work Order) this Month</Text>
        <TouchableOpacity style={styles.monthContainer}>
          <Text style={styles.monthText}>{currentMonthName}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>

        <View style={styles.leftContainer}>
          {DataItems(deStructure[0].value, deStructure[0].label, '#ffd16a')}
          {DataItems(deStructure[1].value, deStructure[1].label, '#d12729')}
        </View>

        <View style={styles.leftContainer}>
          {DataItems(deStructure[2].value, deStructure[2].label, '#2352d3')}
          {DataItems(deStructure[3].value, deStructure[3].label, '#68e974')}
        </View>
      </View>

      <PieChart
        style={styles.chart}
        logEnabled={true}
        chartBackgroundColor={processColor('#F2F2F2')}
        chartDescription={description}
        data={data}
        legend={legend}
        highlights={highlights}
        extraOffsets={{ left: 0, top: 0, right: 0, bottom: 0 }}
        entryLabelColor={processColor('green')}
        entryLabelFontFamily={constants.fontMedium}
        drawEntryLabels={false}
        rotationEnabled={true}
        rotationAngle={145}
        usePercentValues={true}
        styledCenterText={{ text: deStructure[0].value?.toString(), color: processColor(constants.defaultTextBlack), fontFamily: constants.fontSemiBold, size: 16 }}
        centerTextRadiusPercent={100}
        holeRadius={60}
        holeColor={processColor('#F2F2F2')}
        transparentCircleRadius={60}
        transparentCircleColor={processColor('#F2F2F2')}
        maxAngle={360}
        onSelect={handleSelect}
        onChange={(event) => console.log(event.nativeEvent)}
        touchEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 10,
    marginTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    gap: 15
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  monthContainer: {
    paddingHorizontal: 10,
    borderRadius: 4,
    paddingVertical: 3,
    backgroundColor: constants.monthBackgroundOrange,
  },
  chart: {
    height: 250
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

export default WorkOrderPieChart;
