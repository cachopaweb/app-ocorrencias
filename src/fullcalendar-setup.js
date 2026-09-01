import React from 'react';
import * as ReactDOM from 'react-dom';

if (typeof window !== 'undefined') {
  window.FullCalendarVDom = {
    Component: React.Component,
    createElement: React.createElement,
    render: ReactDOM.render,
    createRef: React.createRef,
    Fragment: React.Fragment,
    createContext: React.createContext,
    createPortal: ReactDOM.createPortal,
    flushSync: (cb) => { if (typeof cb === 'function') cb(); },
    unmountComponentAtNode: ReactDOM.unmountComponentAtNode,
  };
}
