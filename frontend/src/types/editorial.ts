/**
 * Editorial Types - Main entry point for all editorial component types
 *
 * Use this for editorial components:
 *   import { EditorialComponentProps, BaseComponentProps, ... } from '@/types/editorial'
 *
 * ⚠️ NOTE: This is for editorial/editor code only.
 * Production code should use '@/types' (index.ts)
 */

// ============================================================================
// Core Editorial Component Props
// ============================================================================

/**
 * Props that all editorial components receive
 * Used by *Edit.tsx components
 */
export type EditorialComponentProps = {
    id: string;
    context?: string;
  };
  
  // ============================================================================
  // Re-export Component Base Types
  // ============================================================================
  
  // These are also exported in index.ts for production use
  export * from './componentTypes';
  
  // Import BaseComponentProps for use in type aliases below
  import type { BaseComponentProps } from './componentTypes';
  
  // ============================================================================
  // Re-export Editorial-Related Types
  // ============================================================================
  
  export * from './colors';
  export * from './navbar';
  export * from './website';
  export * from './templateTypes';
  export * from './llmOutputs';
  
  export * from './forms';
  export * from './user';
  
  // ============================================================================
  // Type Aliases for Clarity
  // ============================================================================
  
  /** 
   * Alias for component state (partial props)
   * Use when component props come from store and may be incomplete
   */
  export type ComponentState<T extends BaseComponentProps = BaseComponentProps> = Partial<T>;
  
  /**
   * Alias for component defaults (required props)
   * Use for default prop objects that must have all fields
   */
  export type ComponentDefaults<T extends BaseComponentProps = BaseComponentProps> = Required<T>;
  