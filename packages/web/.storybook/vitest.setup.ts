import { setProjectAnnotations } from '@storybook/react'
import * as projectAnnotations from './preview'

// Apply Storybook preview annotations (decorators, globals, parameters) in Vitest.
setProjectAnnotations([projectAnnotations])
