import * as React from "react";
import {
    Link,
    Navigate,
    Outlet,
} from "react-router-dom";
import Blender from "../page/blender";

const routes = [
    {
        path: "/",
        element: (
            <div>
                <h1>Hello World</h1>
                <Link to="about">About Us</Link>
                <Navigate to="test" replace />
                <Outlet />
            </div>
        ),
        children: [
            {
                path: "test",
                element: (
                    <div>
                        <h1>Test</h1>
                        <Link to="/about">About Us</Link>
                    </div>
                ),
            },
        ],
    },
    {
        path: "about",
        element: <div>About</div>,
    },
    {
        path: "blender",
        element: <Blender />
    },
];

export default routes;