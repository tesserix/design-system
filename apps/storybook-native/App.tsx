import React from 'react'
import { SafeAreaView, Text, View } from 'react-native'

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', textAlign: 'center' }}>Tesserix Native Storybook</Text>
        <Text style={{ textAlign: 'center', color: '#6B7280' }}>
          Run with STORYBOOK_ENABLED=true to open component stories.
        </Text>
      </View>
    </SafeAreaView>
  )
}
