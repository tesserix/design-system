import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface FileUploadFile {
  /** File URI */
  uri: string
  /** File name */
  name?: string
  /** File type */
  type?: string
  /** File size in bytes */
  size?: number
}

export interface FileUploadProps {
  /** Selected files */
  files?: FileUploadFile[]
  /** Callback when files are selected */
  onSelect?: (files: FileUploadFile[]) => void
  /** Callback when file is removed */
  onRemove?: (index: number) => void
  /** Accept file types */
  accept?: 'image' | 'video' | 'all'
  /** Allow multiple files */
  multiple?: boolean
  /** Maximum file size in bytes */
  maxSize?: number
  /** Label text */
  label?: string
  /** Error message */
  error?: string
  /** Disabled state */
  disabled?: boolean
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files = [],
  onSelect,
  onRemove,
  accept = 'all',
  multiple = true,
  maxSize,
  label,
  error,
  disabled = false,
  style,
}) => {
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSelect = () => {
    if (disabled) return

    // Note: In a real implementation, you would use expo-image-picker or react-native-document-picker
    // This is a placeholder showing the interface
    const mockFile: FileUploadFile = {
      uri: 'file://mock-file.jpg',
      name: 'mock-file.jpg',
      type: 'image/jpeg',
      size: 1024 * 100, // 100KB
    }

    if (maxSize && mockFile.size && mockFile.size > maxSize) {
      setLocalError(`File size exceeds ${maxSize} bytes`)
      return
    }

    setLocalError(null)
    const newFiles = multiple ? [...files, mockFile] : [mockFile]
    onSelect?.(newFiles)
  }

  const handleRemove = (index: number) => {
    onRemove?.(index)
  }

  const displayError = error || localError

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.uploadArea,
          disabled && styles.uploadAreaDisabled,
          displayError && styles.uploadAreaError,
        ]}
        onPress={handleSelect}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label || 'Upload file'}
        accessibilityState={{ disabled }}
      >
        <Text style={styles.uploadIcon}>📁</Text>
        <Text style={styles.uploadText}>
          {accept === 'image'
            ? 'Tap to select image'
            : accept === 'video'
            ? 'Tap to select video'
            : 'Tap to select file'}
        </Text>
        {maxSize && (
          <Text style={styles.uploadHint}>
            Max size: {Math.round(maxSize / 1024)}KB
          </Text>
        )}
      </TouchableOpacity>

      {files.length > 0 && (
        <View style={styles.fileList}>
          {files.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              {file.type?.startsWith('image/') && file.uri ? (
                <Image source={{ uri: file.uri }} style={styles.thumbnail} />
              ) : (
                <View style={styles.filePlaceholder}>
                  <Text style={styles.fileIcon}>📄</Text>
                </View>
              )}
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name || 'Unnamed file'}
                </Text>
                {file.size && (
                  <Text style={styles.fileSize}>
                    {Math.round(file.size / 1024)}KB
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => handleRemove(index)}
                style={styles.removeButton}
                accessibilityRole="button"
                accessibilityLabel="Remove file"
              >
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {displayError && <Text style={styles.error}>{displayError}</Text>}
    </View>
  )
}

FileUpload.displayName = 'FileUpload'

const styles = StyleSheet.create({
  container: {
    marginBottom: semanticSpacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: '#374151',
    marginBottom: semanticSpacing.xs,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: semanticSpacing.xl,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  uploadAreaDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  uploadAreaError: {
    borderColor: '#ef4444',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: semanticSpacing.sm,
  },
  uploadText: {
    fontSize: fontSize.base,
    color: '#6b7280',
    marginBottom: semanticSpacing.xs,
  },
  uploadHint: {
    fontSize: fontSize.sm,
    color: '#9ca3af',
  },
  fileList: {
    marginTop: semanticSpacing.md,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: semanticSpacing.sm,
    marginBottom: semanticSpacing.xs,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  filePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIcon: {
    fontSize: 24,
  },
  fileInfo: {
    flex: 1,
    marginLeft: semanticSpacing.sm,
  },
  fileName: {
    fontSize: fontSize.sm,
    color: '#111827',
    fontWeight: '500',
  },
  fileSize: {
    fontSize: fontSize.xs,
    color: '#6b7280',
    marginTop: 2,
  },
  removeButton: {
    padding: semanticSpacing.xs,
  },
  removeText: {
    fontSize: 18,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  error: {
    fontSize: fontSize.sm,
    color: '#ef4444',
    marginTop: semanticSpacing.xs,
  },
})
