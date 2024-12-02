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
} from "@fluentui/react-icons";
import Layout from "../components/Layout";
import First from "../page/First";
import Second from "../page/Second";
import Third from "../page/Third";
import Fourth from "../page/Fourth";
import Cannon from "../page/Cannon";
import Crazy from "../page/Crazy";
import BasicDemo from "../page/BasicDemo";
import CubeCameraDemo from "../page/CubeCameraDemo";
import Controls from "../page/Controls";
import Demo from "../page/Demo";
import RTFBasicDemo from "../page/RTFBasicDemo";
import LightDemo from "../page/Light";
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
        icon: <Dashboard />,
        element: <First />,
    },
    {
        path: "/second",
        name: "Second",
        icon: <Dashboard />,
        element: <Second />,
    },
    {
        path: "/third",
        name: "Third",
        icon: <Dashboard />,
        element: <Third />,
    },
    {
        path: "/fourth",
        name: "Fourth",
        icon: <Dashboard />,
        element: <Fourth />,
    },
    {
        path: "/cannon",
        name: "Cannon",
        icon: <Dashboard />,
        element: <Cannon />,
    },
    {
        path: "/crazy",
        name: "Crazy",
        icon: <Dashboard />,
        element: <Crazy />,
    },
    {
        path: "/basicDemo",
        name: "BasicDemo",
        icon: <Dashboard />,
        element: <BasicDemo />,
    },
    {
        path: "/RTFBasicDemo",
        name: "RTFBasicDemo",
        icon: <Dashboard />,
        element: <RTFBasicDemo />,
    },
    {
        path: "/light",
        name: "Light",
        icon: <Dashboard />,
        element: <LightDemo />,
    },
    {
        path: "/cubeCamera",
        name: "CubeCamera",
        icon: <Dashboard />,
        element: <CubeCameraDemo />,
    },
    {
        path: "/controls",
        name: "Controls",
        icon: <Dashboard />,
        element: <Controls />,
    },
    {
        path: "/demo",
        name: "Demo",
        icon: <Dashboard />,
        element: <Demo />,
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
        path: "/404",
        name: "404",
        element: <div>404</div>,
    }
];

export default RootRoutes;