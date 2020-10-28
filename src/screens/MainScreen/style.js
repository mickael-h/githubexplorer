import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  repoItemInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  repoItemInfoView: {
    marginTop: 4,
    flex: 1,
    flexDirection: 'row',
  },
  fillerCtn: {
    flex: 1,
    marginTop: 50,
    width: '75%',
    alignSelf: 'center',
  },
  fillerMessage: {
    fontStyle: 'italic',
    color: 'grey',
    fontSize: 28,
    textAlign: 'center',
  },
  hiddenButton: {
    width: 0,
  },
});

export default style;
