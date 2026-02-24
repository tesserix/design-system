// Add custom jest matchers from @testing-library/react-native
import '@testing-library/react-native/extend-expect'

// Mock React Native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
