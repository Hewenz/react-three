import * as React from "react";
import {
    Link,
    Navigate,
    Outlet,
} from "react-router-dom";
import {
    Board20Filled,
    Board20Regular,
    MegaphoneLoud20Filled,
    MegaphoneLoud20Regular,
    bundleIcon,
    PersonCircle32Regular,
} from "@fluentui/react-icons";
import Layout from "../components/Layout";
import First from "../page/First";
// import Blender from "../page/blender";
const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Announcements = bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular);

/**
 * path: 实际URL路径 ，开头不要省略 /
 * name：显示在导航栏的名称
 * index：是否为默认页面
 */

export const Routes = [
    {
        path: "/",
        name: "Home",
        icon: <Announcements />,
        element: <div>Home</div>,
    },
    {
        path: "/first",
        name: "First",
        icon: <Announcements />,
        element: <First />,
    },
    {
        path: "/test",
        name: "Tests",
        icon: <Dashboard />,
        element: <>
            <Navigate to="/test/test" replace />
            <Outlet />
        </>,
        children: [
            {
                name: "Test",
                path: "/test/test",
                element: (
                    <div>
                        <h1>Test</h1>
                        <Link to="/test/new">New</Link>
                    </div>
                )
            },
            {
                name: "New",
                path: "/test/new",
                index: false,
                element: (
                    <div>
                        <h1>New</h1>
                        <Link to="/test/test">Test</Link>
                    </div>
                ),
            }
        ]
    },
];

const RootRoutes = [
    {
        element: (
            <>
                <Layout />
            </>
        ),
        children: Routes,
    },
    {
        path: "/about",
        name: "About",
        element: <div>About</div>,
    }
];

export default RootRoutes;