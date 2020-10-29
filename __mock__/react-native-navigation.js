const constants = () => new Promise(resolve => resolve({ topBarHeight: 80 }));
const setDefaultOptions = () => jest.fn();
const setRoot = () => jest.fn();
const mergeOptions = () => jest.fn();
const events = () => ({
  registerNavigationButtonPressedListener: () => ({
    remove: () => jest.fn(),
  }),
  registerComponentDidAppearListener: () => ({
    remove: () => jest.fn(),
  }),
});
const showOverlay = () => jest.fn();

export {
  constants,
  setDefaultOptions,
  setRoot,
  mergeOptions,
  events,
  showOverlay,
};
