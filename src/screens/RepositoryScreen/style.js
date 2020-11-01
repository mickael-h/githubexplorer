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
  avatar: {
    marginHorizontal: 20,
    width: 90,
    height: 90,
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
