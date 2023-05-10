import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * State Type
 */
export interface ResponsiveDrawerStateType {
  isDrawerOpened: boolean; // Indicates drawer open state
  isDrawerOpenable: boolean; // Indicates if drawer can be opened or not | It can also be used to indicate hiding or showing of drawer open button
  isBreakpointExceeded: boolean;
}

/**
 * Initial State
 */
const responsiveDrawerInitState: ResponsiveDrawerStateType = {
  isDrawerOpened: false,
  isDrawerOpenable: false,
  isBreakpointExceeded: false,
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
      if (state.isDrawerOpenable) {
        // Opening or closing drawer should only work in mobile sizes
        state.isDrawerOpened = action.payload;
      }
    },
    setIsDrawerOpenable(
      state: ResponsiveDrawerStateType,
      action: PayloadAction<boolean>
    ) {
      state.isDrawerOpenable = action.payload;
    },
    // To handle opening & closing of drawer
    toggleDrawer(state: ResponsiveDrawerStateType) {
      // If `vw` is below given breakpoint
      if (state.isDrawerOpenable) {
        // Toggling drawer will only work in mobile sizes
        state.isDrawerOpened = !state.isDrawerOpened;
      }
    },
    // To get the drawer breakpoint width
    setIsBreakpointExceeded(
      state: ResponsiveDrawerStateType,
      action: PayloadAction<boolean>
    ) {
      state.isBreakpointExceeded = action.payload;
    },
  },
});

export const _responsiveDrawerStore = configureStore({
  reducer: slice.reducer,
});

export const responsiveDrawerActions = slice.actions;
