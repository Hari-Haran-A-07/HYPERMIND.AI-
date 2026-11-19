import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_MODEL_ID } from '@/lib/models';

export interface UIState {
  // Sidebar state (desktop)
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Mobile navigation drawer state
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;

  // Command palette state (Cmd+K / Ctrl+K)
  commandMenuOpen: boolean;
  setCommandMenuOpen: (open: boolean) => void;
  toggleCommandMenu: () => void;

  // Active Model selection
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
  modelSelectorOpen: boolean;
  setModelSelectorOpen: (open: boolean) => void;
  toggleModelSelector: () => void;

  // Active conversation tracking
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  // Context drawer / Inspector panel
  isContextDrawerOpen: boolean;
  toggleContextDrawer: (open?: boolean) => void;
  setContextDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      mobileNavOpen: false,
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
      toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),

      commandMenuOpen: false,
      setCommandMenuOpen: (open) => set({ commandMenuOpen: open }),
      toggleCommandMenu: () => set((state) => ({ commandMenuOpen: !state.commandMenuOpen })),

      selectedModelId: DEFAULT_MODEL_ID,
      setSelectedModelId: (modelId) => set({ selectedModelId: modelId }),
      modelSelectorOpen: false,
      setModelSelectorOpen: (open) => set({ modelSelectorOpen: open }),
      toggleModelSelector: () =>
        set((state) => ({ modelSelectorOpen: !state.modelSelectorOpen })),

      activeConversationId: 'conv-1',
      setActiveConversationId: (id) => set({ activeConversationId: id }),

      isContextDrawerOpen: false,
      toggleContextDrawer: (open) =>
        set((state) => ({ isContextDrawerOpen: open ?? !state.isContextDrawerOpen })),
      setContextDrawerOpen: (open) => set({ isContextDrawerOpen: open }),
    }),
    {
      name: 'hypermind-ui-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        selectedModelId: state.selectedModelId,
        activeConversationId: state.activeConversationId,
      }),
    }
  )
);

export const uiStore = useUIStore;
export default useUIStore;
