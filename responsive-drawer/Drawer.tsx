import { CSSProperties, useEffect, useState } from "react";
import styles from "./Drawer.module.scss";

import { _ResponsiveDrawerProps } from "./ResponsiveDrawerLayout";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveDrawerStateType, responsiveDrawerActions } from "./store";

export default function _Drawer(props: _ResponsiveDrawerProps) {
  /**
   * Variables
   */
  const dispatch = useDispatch();
  const isDrawerOpened = useSelector(
    (state: ResponsiveDrawerStateType) => state.isDrawerOpened
  );
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  //Indicating the location of drawer portal
  const portalTargetNode = document.getElementById("pb93-externals")!!;
  //
  //Styles
  //
  let drawerInitStyle: CSSProperties = {};
  let pagesInitStyle: CSSProperties = {};
  // Setting responsive styles
  if (!isBreakpointExceeded(window.innerWidth) || !props.isResponsive) {
    // if not in desktop mode or isResponsive set to false
    drawerInitStyle = {
      transform: "translateX(-100%)",
    };
    pagesInitStyle = { left: 0 };
  }
  // Setting state styles
  const [drawerStyle, setDrawerStyle] =
    useState<CSSProperties>(drawerInitStyle);
  const [pagesStyle, setPagesStyle] = useState<CSSProperties>(pagesInitStyle);
  const [overlayStyle, setOverlayStyle] = useState<CSSProperties>({});

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  /**
   * Functions
   */
  function isBreakpointExceeded(windowWidth: number): boolean {
    return windowWidth >= props.breakpointWidth!!;
  }

  /**
   * Hooks
   */
  // To indicate component is loaded and set drawer initial style
  useEffect(() => {
    // Setting component is loaded
    setIsComponentLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Calculating realtime width & setting IsDrawerOpenable
   */

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

    // Updating redux state with is Breakpoint Reached
    dispatch(
      responsiveDrawerActions.setIsBreakpointExceeded(
        isBreakpointExceeded(viewportWidth)
      )
    );

    // setting responsiveness
    if (!isBreakpointExceeded(viewportWidth) || !props.isResponsive) {
      /**
       * If mobile mode or not responsive
       */
      setDrawerStyle(drawerInitStyle);
      setPagesStyle(pagesInitStyle);

      /**
       *
       * If screen becomes `desktop` size while drawer is opened
       * 1) close the overlay
       * 2) change the `isDrawerOpened` to false
       */
      setOverlayStyle({});
      dispatch(responsiveDrawerActions.setIsDrawerOpened(false));

      //Setting `IsDrawerOpenable for redux. used in `toggleDrawer` only
      dispatch(responsiveDrawerActions.setIsDrawerOpenable(true));
    } else {
      /**
       * If desktop mode or resposive is true
       */
      if (!isDrawerOpened) {
        /**
         * If this condition is not added,
         * then when screen width is changed in mob mode while drawer opened
         * It will closed but overlay remains
         */
        setDrawerStyle({ transform: "translateX(0)" });
        setPagesStyle({ left: props.drawerWidth });
      }
      //Setting `IsDrawerOpenable for redux. used in `toggleDrawer` only
      dispatch(responsiveDrawerActions.setIsDrawerOpenable(false));
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
  useEffect(() => {
    if (!(isBreakpointExceeded(viewportWidth) && props.isResponsive)) {
      // We can open drawer if in desktop mode & responsive set to true
      // else we can't
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpened]);

  /**
   * JSX
   */
  return (
    <div
      id="main"
      style={
        {
          "--drawer-width": `${props.drawerWidth!!}px`,
        } as any
      }
    >
      {
        /**
         * `createPortal()` is executed when component is loaded completely
         * if `createPortal()` is executed before component is loaded it will give error in nextJS that
         * 'Target Container (#pb93-externals) is not a DOM element'
         */
        isComponentLoaded &&
          createPortal(
            <div
              style={
                {
                  "--drawer-width":
                    props.drawerWidth!! <= 0
                      ? `${window.innerWidth - 1}px`
                      : `${props.drawerWidth!! - 1}px`,
                  "--drawer-border-color": `${props.drawerBorderColor}`,
                  "--drawer-border-width": `${props.drawerBorderWidth}px`,
                } as any
              }
            >
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
            </div>,
            portalTargetNode
          )
      }
      <section id={styles["pages-section"]} style={pagesStyle}>
        {props.children}
      </section>
    </div>
  );
}
