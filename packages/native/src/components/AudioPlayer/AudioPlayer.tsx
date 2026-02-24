import React, { useState } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface AudioPlayerProps {
  /** Audio source URI */
  source: { uri: string }
  /** Track title */
  title?: string
  /** Track artist */
  artist?: string
  /** Initial playback state */
  autoPlay?: boolean
  /** Loop audio */
  loop?: boolean
  /** Callback when audio ends */
  onEnd?: () => void
  /** Callback on error */
  onError?: (error: Error) => void
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  source,
  title,
  artist,
  autoPlay = false,
  loop = false,
  onEnd,
  onError,
  style,
}) => {
  void loop
  void onEnd
  void onError
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(180) // Mock duration

  // Note: In a real implementation, use expo-av or react-native-track-player
  // This is a placeholder showing the interface

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 10))
  }

  const handleSkipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="none"
      accessibilityLabel={`Audio player${source.uri ? ` for ${source.uri}` : ''}`}
    >
      {(title || artist) && (
        <View style={styles.info}>
          {title && <Text style={styles.title}>{title}</Text>}
          {artist && <Text style={styles.artist}>{artist}</Text>}
        </View>
      )}

      <View style={styles.waveform}>
        {/* Waveform visualization placeholder */}
        <View style={styles.waveformBars}>
          {[...Array(30)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.bar,
                { height: Math.random() * 40 + 10 },
                i < (progress / 100) * 30 && styles.barActive,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handleSkipBack}
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel="Skip backward 10 seconds"
        >
          <Text style={styles.controlIcon}>⏪</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlayPause}
          style={[styles.controlButton, styles.playButton]}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
        >
          <Text style={[styles.controlIcon, styles.playIcon]}>
            {isPlaying ? '⏸' : '▶️'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSkipForward}
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel="Skip forward 10 seconds"
        >
          <Text style={styles.controlIcon}>⏩</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

AudioPlayer.displayName = 'AudioPlayer'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: semanticSpacing.lg,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  info: {
    marginBottom: semanticSpacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: '#111827',
    marginBottom: semanticSpacing.xs,
  },
  artist: {
    fontSize: fontSize.sm,
    color: '#6b7280',
  },
  waveform: {
    height: 60,
    marginBottom: semanticSpacing.md,
  },
  waveformBars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  bar: {
    width: 3,
    backgroundColor: '#d1d5db',
    borderRadius: 1.5,
  },
  barActive: {
    backgroundColor: '#3b82f6',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: semanticSpacing.md,
  },
  timeText: {
    fontSize: fontSize.xs,
    color: '#6b7280',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    padding: semanticSpacing.sm,
    marginHorizontal: semanticSpacing.sm,
  },
  playButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 24,
    color: '#6b7280',
  },
  playIcon: {
    color: '#ffffff',
    fontSize: 28,
  },
})
