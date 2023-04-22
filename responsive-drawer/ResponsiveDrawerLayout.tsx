import "./ResponsiveDrawerLayout.css";
import { Provider } from "react-redux";
import Drawer from "./Drawer";

import React from "react";
import { _responsiveDrawerStore } from "../../components/responsive-drawer/store";

export interface _ResponsiveDrawerProps {
  drawerContent: JSX.Element;
  isResponsive?: boolean;
  children: React.ReactNode; // Children must be same as this
}

/**
 * This Component is solely for wrap drawer around redux store
 */

export default function ResponsiveDrawerLayout({
  isResponsive = true, // setting default value for props
  ...props
}: _ResponsiveDrawerProps) {
  return (
    // Adding `plainDrawerStore` DrawerLayout & its childs
    <Provider store={_responsiveDrawerStore}>
      <Drawer drawerContent={props.drawerContent} isResponsive={isResponsive}>
        {props.children}
      </Drawer>
    </Provider>
  );
}
