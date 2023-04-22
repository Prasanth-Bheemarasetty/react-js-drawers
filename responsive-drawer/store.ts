import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * State Type
 */
export interface ResponsiveDrawerStateType {
  isDrawerOpened: boolean; // Indicates opening of Drawer
  isMob: boolean;
  isResponsive: boolean;
}

/**
 * Initial State
 */
const responsiveDrawerInitState: ResponsiveDrawerStateType = {
  isDrawerOpened: false,
  isMob: false,
  isResponsive: false,
};

/**
 * Slice
 */
const slice = createSlice({
  name: "responsive-drawer",
  initialState: responsiveDrawerInitState,
  reducers: {
    // Setting `isDrawerOpen` state
    setIsDrawerOpened(
      state: ResponsiveDrawerStateType,
      action: PayloadAction<boolean>
    ) {
      if (state.isMob) {
        // Opening or closing drawer should only work in mobile sizes
        state.isDrawerOpened = action.payload;
      }
    },
    setIsMob(state: ResponsiveDrawerStateType, action: PayloadAction<boolean>) {
      state.isMob = action.payload;
    },
    setIsResponsive(
      state: ResponsiveDrawerStateType,
      action: PayloadAction<boolean>
    ) {
      state.isResponsive = action.payload;
    },
    // To handle opening & closing of drawer
    toggleDrawer(state: ResponsiveDrawerStateType) {
      // If `vw` is below given breakpoint
      if (state.isMob) {
        // Toggling drawer will only work in mobile sizes
        state.isDrawerOpened = !state.isDrawerOpened;
      }
    },
  },
});

export const _responsiveDrawerStore = configureStore({
  reducer: slice.reducer,
});

export const responsiveDrawerActions = slice.actions;
