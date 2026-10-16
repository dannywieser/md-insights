import type { Api } from '../../shared/ipc'

declare global {
  interface Window {
    /** exposed by the preload script. */
    api: Api
  }
}
