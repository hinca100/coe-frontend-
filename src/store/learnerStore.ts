// /store/learnerStore.ts
import { create } from "zustand"

type LearnerState = {
  activeSection: string
  setActiveSection: (section: string) => void
}

export const useLearnerStore = create<LearnerState>((set) => ({
  activeSection: "Explorar",
  setActiveSection: (section) => set({ activeSection: section }),
}))