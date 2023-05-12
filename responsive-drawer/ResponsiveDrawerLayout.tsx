import "./ResponsiveDrawerLayout.css";
import { Provider } from "react-redux";
import Drawer from "./Drawer";

import React from "react";
import { _responsiveDrawerStore } from "./store";

export interface _ResponsiveDrawerProps {
  drawerContent: JSX.Element;
  breakpointWidth?: number;
  drawerWidth?: number;
  drawerBorderColor?: string;
  drawerBorderWidth?: number;
  isResponsive?: boolean;
  children: React.ReactNode; // Children must be same as this
}

/**
 * This Component is solely for wrap drawer around redux store
 */

export default function ResponsiveDrawerLayout({
  breakpointWidth = 992,
  drawerWidth = 320,
  drawerBorderColor = "#edeef0",
  drawerBorderWidth = 1,
  isResponsive = true, // setting default value for props
  ...props
}: _ResponsiveDrawerProps) {
  return (
    // Adding `plainDrawerStore` DrawerLayout & its childs
    <Provider store={_responsiveDrawerStore}>
      <Drawer
        drawerContent={props.drawerContent}
        breakpointWidth={breakpointWidth}
        drawerWidth={drawerWidth}
        drawerBorderColor={drawerBorderColor}
        drawerBorderWidth={drawerBorderWidth}
        isResponsive={isResponsive}
      >
        {props.children}
      </Drawer>
    </Provider>
  );
}
