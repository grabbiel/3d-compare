import { useMemo, useSyncExternalStore } from 'react'
import type { CompareDocument } from '../domain/document.ts'
import {
  attachNavRig,
  type CompareApp,
  type NavRig,
} from './compare-app.ts'

export function useCompare(app: CompareApp): CompareDocument {
  return useSyncExternalStore(app.subscribe, app.getState, app.getState)
}

export function useNavRig(app: CompareApp): NavRig {
  return useMemo(() => attachNavRig(app), [app])
}
