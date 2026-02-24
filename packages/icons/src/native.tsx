/**
 * Lucide Icons for React Native
 * Re-exports all icons from lucide-react-native with additional utilities
 *
 * @see https://lucide.dev
 */

export * from 'lucide-react-native'

// Common icon sets for easy importing
export {
  // Navigation
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,

  // Actions
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Copy,
  Download,
  Upload,
  Share2,
  ExternalLink,

  // UI
  Search,
  Settings,
  User,
  Users,
  Bell,
  Mail,
  Calendar,
  Clock,
  Heart,
  Star,

  // Status
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  HelpCircle,
  Loader2,

  // Media
  Image,
  File,
  FileText,
  Folder,
  FolderOpen,
  Camera,
  Video,
  Music,

  // Other
  Eye,
  EyeOff,
  Lock,
  Unlock,
  LogIn,
  LogOut,
  MoreHorizontal,
  MoreVertical,
  Github,
} from 'lucide-react-native'

import type { LucideProps, LucideIcon } from 'lucide-react-native'

// Re-export types
export type { LucideProps, LucideIcon }

/**
 * Icon sizes based on Tesserix design tokens
 */
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
} as const

export type IconSize = keyof typeof iconSizes

/**
 * Get icon size in pixels
 */
export function getIconSize(size: IconSize = 'md'): number {
  return iconSizes[size]
}
