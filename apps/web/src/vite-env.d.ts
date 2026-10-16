/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the note cache service; defaults to http://localhost:8787. */
  readonly VITE_CACHE_URL?: string
}
