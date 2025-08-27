import { StyleSheet } from 'react-native';
import constants from '../../constants/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: constants.colorWhite,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: constants.lightGrayBorder,
    paddingLeft: 10,
    gap: 5,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    height: 47,
    width: 47,
    backgroundColor: constants.red,
  },
  searchButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: constants.red,
    marginHorizontal: 20
  },
  inputStyle: {
    flex: 1,
    fontSize: 14,
    fontFamily: constants.fontMedium
  },
  defaultText: {
    width: '85%',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
    fontFamily: constants.fontRegular,
    color: constants.defaultTextBlack
  },
  questionTextStyle: {
    flex: 1,
    textAlign: 'left',
    fontSize: 14,
    fontFamily: constants.fontMedium,
    color: constants.defaultTextBlack,
    textTransform:'capitalize'
  },
  answerTextStyle: {
    textAlign: 'right',
    fontSize: 14,
    fontFamily: constants.fontSemiBold,
    color: constants.defaultTextBlack,
    textTransform:'capitalize'
  },
  SearchButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: constants.fontSemiBold,
    color: constants.colorWhite
  },
  defaultImageStyle: {
    width: '80%',
    height: 282,
    alignSelf: 'center'
  }
});
export default styles;
