import styles from "./Drawer.module.scss";

import { CSSProperties, Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { _ResponsiveDrawerProps } from "./ResponsiveDrawerLayout";
import { ResponsiveDrawerStateType, responsiveDrawerActions } from "./store";

export default function _Drawer(props: _ResponsiveDrawerProps) {
  // Breakpoint width
  const breakpointWidth = props.breakpointWidth!!;

  // Redux dispatcher
  const dispatch = useDispatch();

  /**
   * Declaring Styles
   */
  // For Drawer
  const drawerInitStyle: CSSProperties = {
    width: props.drawerWidth,
    borderRightColor: props.drawerBorderColor,
  }; // To make this style will remain even the drawer style is changed. i.e., every drawer style should contain `initStyles`
  const [drawerStyle, setDrawerStyle] =
    useState<CSSProperties>(drawerInitStyle);

  // For Pages
  const pagesInitStyle: CSSProperties = { left: props.drawerWidth };
  const [pagesStyle, setPagesStyle] = useState<CSSProperties>(pagesInitStyle);

  // For Overlay
  const [overlayStyle, setOverlayStyle] = useState<CSSProperties>({});

  /**
   * Indicating the location of drawer portal
   */
  const portalTargetNode = document.getElementById("pb93-externals")!!;

  /**
   * Setting component is loaded
   */
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  useEffect(() => {
    setIsComponentLoaded(true);
  }, []);

  /**
   * Calculating realtime width & setting isMob
   */
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    /**
     * Function to resize width
     */
    let resizeWidth = () => {
      setViewportWidth(window.innerWidth);
    };
    /**
     * Calculating realtime width starts here
     */
    resizeWidth();
    /**
     * Attaching the`resize()` function to window as listener
     */
    window.addEventListener("resize", resizeWidth);

    // setting responsiveness
    if (viewportWidth < breakpointWidth || !props.isResponsive) {
      /**
       * If `vw` < 992 or resposive is false
       */
      if (!isDrawerOpened) {
        /**
         * If this condition is not added,
         * then when screen width is changed in mob mode while drawer opened
         * It will closed but overlay remains
         */
        setDrawerStyle({ ...drawerInitStyle, transform: "translateX(-100%)" });
        setPagesStyle({ ...pagesInitStyle, left: "0", width: "100%" });
      }
      //Setting `isMob for redux. used in `toggleDrawer` only
      dispatch(responsiveDrawerActions.setIsMob(true));
    } else {
      /**
       * If responsive is opted or desktop mode(vw >= 992)
       */
      setDrawerStyle({ ...drawerInitStyle });
      setPagesStyle(pagesInitStyle);

      /**
       *
       * If screen becomes `desktop` size while drawer is opened
       * 1) close the overlay
       * 2) change the `isDrawerOpened` to false
       */
      setOverlayStyle({});
      dispatch(responsiveDrawerActions.setIsDrawerOpened(false));

      //Setting `isMob for redux. used in `toggleDrawer` only
      dispatch(responsiveDrawerActions.setIsMob(false));
    }

    /**
     * Removeing the listener to window when component is unmounted
     */
    return () => window.removeEventListener("resize", resizeWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportWidth]);

  /**
   * Toggling drawer
   *
   */
  const isDrawerOpened = useSelector(
    (state: ResponsiveDrawerStateType) => state.isDrawerOpened
  );
  useEffect(() => {
    if (isDrawerOpened) {
      // showing the overlay below drawer
      setOverlayStyle({ backgroundColor: "black", visibility: "visible" });
      // Opening the drawer
      setDrawerStyle({ transform: "translateX(0%)" });
    } else {
      // Hiding the overlay
      setOverlayStyle({});
      // Closing the drawer
      setDrawerStyle({ transform: "translateX(-100%)" });
    }
  }, [isDrawerOpened]);

  /**
   *
   * JSX
   *
   */

  return (
    <main id="main">
      {
        /**
         * `createPortal()` is executed when component is loaded completely
         * if `createPortal()` is executed before component is loaded it will give error in nextJS that
         * 'Target Container (#pb93-externals) is not a DOM element'
         */
        isComponentLoaded &&
          ReactDOM.createPortal(
            <Fragment>
              <section id={styles["drawer-section"]} style={drawerStyle}>
                {props.drawerContent}
              </section>
              <div
                id={styles["overlay"]}
                style={overlayStyle}
                onClick={() => {
                  // Closing the drawer
                  dispatch(responsiveDrawerActions.setIsDrawerOpened(false));
                }}
              />
            </Fragment>,
            portalTargetNode
          )
      }
      <section id={styles["pages-section"]} style={pagesStyle}>
        {props.children}
      </section>
    </main>
  );
}
