// Intentionally minimal for React Native + @testing-library/react-native v13.
// In Jest, mock Modal to render children inline when visible.
jest.mock('react-native/Libraries/Modal/Modal', () => {
  const React = require('react')
  return ({ visible, children }) => (visible ? React.createElement(React.Fragment, null, children) : null)
})
