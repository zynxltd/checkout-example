import type { DashboardSnapshot } from '../types/domain.js'

/**
 * Contract for assembling the ops dashboard snapshot.
 */
export interface IDashboardService {
  build(): Promise<DashboardSnapshot>
}
