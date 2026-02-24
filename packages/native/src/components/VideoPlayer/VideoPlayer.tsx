import React, { useEffect, useState } from 'react'
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

export interface VideoPlayerProps {
  /** Video source URI */
  source: { uri: string }
  /** Initial playback state */
  autoPlay?: boolean
  /** Loop video */
  loop?: boolean
  /** Show controls */
  showControls?: boolean
  /** Callback when video ends */
  onEnd?: () => void
  /** Callback on error */
  onError?: (error: Error) => void
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  source,
  autoPlay = false,
  loop = false,
  showControls = true,
  onEnd,
  onError,
  style,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(180) // Mock duration

  // Note: In a real implementation, use expo-av or react-native-video
  // This is a placeholder showing the interface
  useEffect(() => {
    if (!source.uri.trim()) {
      onError?.(new Error('Video source URI is required'))
    }
  }, [onError, source.uri])

  useEffect(() => {
    if (!isPlaying) return

    const id = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1
        if (next < duration) return next

        if (loop) return 0

        setIsPlaying(false)
        onEnd?.()
        return duration
      })
    }, 1000)

    return () => clearInterval(id)
  }, [duration, isPlaying, loop, onEnd])

  const handlePlayPause = () => {
    if (!source.uri.trim()) {
      onError?.(new Error('Video source URI is required'))
      return
    }
    setIsPlaying(!isPlaying)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={`Video player${source.uri ? ` for ${source.uri}` : ''}`}
      accessibilityHint="Use controls to play, pause, and mute video"
    >
      {/* Video placeholder */}
      <View style={styles.videoPlaceholder}>
        <Text style={styles.placeholderText}>
          {source.uri ? '🎬 Video' : 'No video source'}
        </Text>
      </View>

      {showControls && (
        <View style={styles.controls}>
          <View style={styles.topControls}>
            <TouchableOpacity
              onPress={handlePlayPause}
              style={styles.controlButton}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
            >
              <Text style={styles.controlIcon}>
                {isPlaying ? '⏸' : '▶️'}
              </Text>
            </TouchableOpacity>

            <View style={styles.timeDisplay}>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleMute}
              style={styles.controlButton}
              accessibilityRole="button"
              accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
            >
              <Text style={styles.controlIcon}>
                {isMuted ? '🔇' : '🔊'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Progress bar placeholder */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                { width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  )
}

VideoPlayer.displayName = 'VideoPlayer'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#000000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    aspectRatio: 16 / 9,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: fontSize.lg,
    color: '#9ca3af',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: semanticSpacing.sm,
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    padding: semanticSpacing.xs,
  },
  controlIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  timeDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  timeText: {
    fontSize: fontSize.sm,
    color: '#ffffff',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginTop: semanticSpacing.sm,
  },
  progress: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
})
