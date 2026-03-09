---
"@tesserix/web": minor
---

Add loading state, validation UI, floating input, skeleton variants, and improved badge/card/dialog

Button:
- Added isLoading and loadingText props with spinner and aria-busy
- Fixed icon-sm size from h-10 to h-8

Input:
- Added isValid/isInvalid props with check/alert icons
- Added helperText/errorText with aria-describedby accessibility
- Bare input returned when no validation props (backward compatible)
- New FloatingInput component with animated floating label

Badge:
- Added asChild prop with Radix Slot support
- Changed base element from div to span
- Added icon support with svg sizing and gap

Skeleton:
- New SkeletonShimmer with gradient animation
- New TextSkeleton with configurable lines and last-line width
- New AvatarSkeleton with sm/md/lg sizes
- New ButtonSkeleton with sm/md/lg sizes
- New TableRowSkeleton with configurable columns

Card:
- Added container queries on CardHeader for responsive action layout
- Added data-slot attributes on all sub-components

Dialog:
- Added showCloseButton prop on DialogContent
