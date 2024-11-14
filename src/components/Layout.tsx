import { Outlet } from 'react-router-dom';
import React from 'react';
import Nav from './Nav';
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
    "App": {
        "width": "100%",
        "min-height": "100vh",
        "display": "flex"
    },
    "Header": {
        "height": "60px",
        "position": "sticky",
        "left": 0,
        "top": 0,
        "zIndex": 1000
    },
    "Aside": {
        "height": "100vh",
        "position": "sticky",
        "left": 0,
        "top": 0,
        "box-sizing": "border-box",
        "flex-shrink": 0,
        "zIndex": 1000
    },
    "Main": {
        "flex": 1,
        boxSizing: "border-box",
    }
});

const Layout = () => {
    const classes = useStyles();
    return (
        <div className={classes.App}>
            <aside className={classes.Aside}>
                <Nav />
            </aside>
            <main className={classes.Main}>
                {/* <header className={classes.Header}>111</header> */}
                <Outlet />
            </main>
        </div>
    )
};

export default Layout;