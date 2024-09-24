import * as React from "react";
import {
    createBrowserRouter,
    Link,
} from "react-router-dom";
import Blender from "../page/blender";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <div>
                <h1>Hello World</h1>
                <Link to="about">About Us</Link>
            </div>
        ),
    },
    {
        path: "about",
        element: <div>About</div>,
    },
    {
        path:"blender",
        element:<Blender/>
    },
]);

export default router;