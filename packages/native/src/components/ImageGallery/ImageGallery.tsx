import React, { useState } from 'react'
import {
  View,
  Image,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'

export interface ImageGalleryItem {
  /** Image source */
  uri: string
  /** Image caption */
  caption?: string
}

export interface ImageGalleryProps {
  /** Array of images */
  images: ImageGalleryItem[]
  /** Initial image index */
  initialIndex?: number
  /** Thumbnail size */
  thumbnailSize?: number
  /** Columns for thumbnail grid */
  columns?: number
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  initialIndex = 0,
  thumbnailSize = 100,
  columns = 3,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const handleThumbnailPress = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x
    const index = Math.round(scrollPosition / screenWidth)
    setCurrentIndex(index)
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        numColumns={columns}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleThumbnailPress(index)}
            style={[
              styles.thumbnail,
              {
                width: thumbnailSize,
                height: thumbnailSize,
                marginRight: index % columns !== columns - 1 ? semanticSpacing.xs : 0,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`View image ${index + 1}${item.caption ? `: ${item.caption}` : ''}`}
          >
            <Image
              source={{ uri: item.uri }}
              style={styles.thumbnailImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        columnWrapperStyle={columns > 1 ? styles.row : undefined}
      />

      <Modal
        visible={isOpen}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Close gallery"
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            initialScrollIndex={currentIndex}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
                {item.caption && (
                  <View style={styles.captionContainer}>
                    <Text style={styles.caption}>{item.caption}</Text>
                  </View>
                )}
              </View>
            )}
          />

          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  )
}

ImageGallery.displayName = 'ImageGallery'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    marginBottom: semanticSpacing.xs,
  },
  thumbnail: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: semanticSpacing.xs,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: semanticSpacing.sm,
  },
  closeText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: semanticSpacing.md,
  },
  caption: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  counter: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: semanticSpacing.xs,
    paddingHorizontal: semanticSpacing.md,
    borderRadius: 20,
  },
  counterText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
})
