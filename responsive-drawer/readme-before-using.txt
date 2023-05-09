1) install
npm install react-router-dom react-redux @reduxjs/toolkit sass

2) If you are using 
	a) ReactJS:
		1. wrap <App /> around <BrowserRouter> in App.js/jsx/tsx. Like below:
    			<BrowserRouter>
      			<App />
    			</BrowserRouter>
		2. make sure you add 
			<div id="pb93-externals"></div> as a first element of <body> in `public/index.html`
	b) Next.js (13 with app dir):
		1. make sure you add 
			<div id="pb93-externals"></div> as a first element of <body> in `src/app/layout.[js/jsx/tsx]`


Exported "Things" from this component:
Drawer.tsx:
-----------
_Drawer

store.tsx:
-----------
ResponsiveDrawerStateType
_responsiveDrawerStore
responsiveDrawerActions