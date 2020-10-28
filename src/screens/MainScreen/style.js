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
  hiddenButton: {
    width: 0,
  },
});

export default style;
