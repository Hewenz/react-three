import React, { useEffect } from "react";
import {
    NavDrawer,
    NavDrawerHeader,
    NavDrawerBody,
    NavItem,
    NavCategory,
    NavCategoryItem,
    NavSubItemGroup,
    NavSubItem,
} from "@fluentui/react-nav-preview";
import { useNavigate } from "react-router-dom";
import { Routes } from "../router/routes";

const Nav = () => {
    const navigate = useNavigate();
    const [path, setPath] = React.useState("");
    useEffect(() => {
        setPath(window.location.pathname);
    }, [window.location.pathname]);
    return (
        <NavDrawer
            style={{ height: "100%" }}
            selectedValue={path}
            type={"inline"}
            open={true}
            multiple={false}
        >
            <NavDrawerHeader>
                Three
            </NavDrawerHeader>
            <NavDrawerBody>
                {
                    Routes.map((route, index) => {
                        return route.children ? (
                            <NavCategory value={route.path} key={route.path}>
                                <NavCategoryItem icon={route.icon}>
                                    {route.name}
                                </NavCategoryItem>
                                <NavSubItemGroup>
                                    {
                                        route.children.map((child) => (
                                            <NavSubItem
                                                key={child.path}
                                                value={child.path}
                                                onClick={() => navigate(child.path)}
                                            >
                                                {child.name}
                                            </NavSubItem>
                                        ))
                                    }
                                </NavSubItemGroup>
                            </NavCategory>
                        ) : (
                            <NavItem
                                key={route.path}
                                icon={route.icon}
                                value={route.path}
                                onClick={() => navigate(route.path)}
                            >
                                {route.name}
                            </NavItem>
                        );
                    })
                }
            </NavDrawerBody>
        </NavDrawer>
    );
};

export default Nav;