import AsyncStorageMock from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import {
  REPO_URL_EXAMPLE_1,
  REPO_URL_EXAMPLE_2,
  REPO_URL_EXAMPLE_3,
} from '../../src/data_examples';

AsyncStorageMock.getItem = jest.fn(async (key, callback) => {
  let result;
  if (key == 'fake_bookmarks') {
    result = `["${REPO_URL_EXAMPLE_1}","${REPO_URL_EXAMPLE_2}","${REPO_URL_EXAMPLE_3}"]`;
  } else {
    const getResult = await AsyncStorageMock.multiGet([key], undefined);
    result = getResult[0] ? getResult[0][1] : null;
  }

  callback && callback(null, result);
  return result;
});

export default AsyncStorageMock;
