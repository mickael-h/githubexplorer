import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 150,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1.5,
  },
  avatar: {
    marginHorizontal: 20,
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 20,
    paddingBottom: 5,
  },
  subtitle: {
    color: 'grey',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookmarkButton: {
    marginHorizontal: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default style;
