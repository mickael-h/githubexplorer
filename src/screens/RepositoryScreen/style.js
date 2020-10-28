import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    maxWidth: '70%',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  titleCtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  divider: {
    marginTop: 15,
  },
});

export default style;
