import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { IPC, type Api, type ScanProgress } from '../shared/ipc'

const api: Api = {
  pickFolder: () => ipcRenderer.invoke(IPC.pickFolder) as Promise<string | null>,
  scanFolder: (folder) =>
    ipcRenderer.invoke(IPC.scanFolder, folder) as Promise<{ mdCount: number }>,
  onScanProgress: (callback) => {
    const listener = (_event: IpcRendererEvent, progress: ScanProgress) => callback(progress)
    ipcRenderer.on(IPC.scanProgress, listener)
    return () => {
      ipcRenderer.removeListener(IPC.scanProgress, listener)
    }
  },
}

contextBridge.exposeInMainWorld('api', api)
