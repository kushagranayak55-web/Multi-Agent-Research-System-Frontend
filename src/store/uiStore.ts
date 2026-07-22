import { create } from "zustand";

/**
 * Deliberately tiny. Anything that is "data from the backend"
 * belongs in researchStore, not here — this store only holds
 * interface state that has no meaning outside the browser tab
 * (e.g. is the mobile nav open). Keeping the two separated means
 * researchStore stays easy to reason about as the single source of
 * truth for the research domain.
 */
interface UiStore {
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
}));
