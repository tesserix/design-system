// Re-export cross-platform hooks from @tesserix/hooks
export {
  useAsync,
  useDebounce,
  useForm,
  useInterval,
  useOnMount,
  useOnUnmount,
  usePrevious,
  useTimeout,
  useToggle,
} from "@tesserix/hooks"
export type { UseToggleReturn } from "@tesserix/hooks"

// Web-specific hooks
export { useClickOutside } from "./use-click-outside"
export { useCopyToClipboard } from "./use-copy-to-clipboard"
export { useFocus } from "./use-focus"
export { useHover } from "./use-hover"
export { useIntersectionObserver } from "./use-intersection-observer"
export { useKeyPress } from "./use-key-press"
export { useLocalStorage } from "./use-local-storage"
export { useMediaQuery } from "./use-media-query"
export { useScrollPosition } from "./use-scroll-position"
export { useWindowSize } from "./use-window-size"
