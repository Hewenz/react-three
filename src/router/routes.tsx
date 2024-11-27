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
// import Blender from "../page/blender";
const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Announcements = bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular);

/**
 * path: 实际URL路径 ，开头不要省略 /
 * name：显示在导航栏的名称
 * index：是否为默认页面
 */

const test = [
    {
        "name": "用途",
        "value": 201001,
        "children": [
            {
                "name": "求职简历",
                "value": 201002,
                "children": [
                    {
                        "name": "简历格式",
                        "value": 201003,
                        "children": [
                            {
                                "name": "单页简历",
                                "value": 201004,
                                "children": []
                            },
                            {
                                "name": "套装简历",
                                "value": 201005,
                                "children": []
                            }
                        ]
                    },
                    {
                        "name": "求职类型",
                        "value": 201006,
                        "children": [
                            {
                                "name": "校招",
                                "value": 201008,
                                "children": []
                            }
                        ]
                    },
                    {
                        "name": "工作年限",
                        "value": 201009,
                        "children": [
                            {
                                "name": "1年以下",
                                "value": 201011,
                                "children": []
                            },
                            {
                                "name": "1-3年",
                                "value": 201012,
                                "children": []
                            },
                            {
                                "name": "3-5年",
                                "value": 201013,
                                "children": []
                            }
                        ]
                    }
                ]
            },
            {
                "name": "升学简历",
                "value": 201015,
                "children": [
                    {
                        "name": "简历格式",
                        "value": 201016,
                        "children": [
                            {
                                "name": "单页简历",
                                "value": 201017,
                                "children": []
                            },
                            {
                                "name": "套装简历",
                                "value": 201018,
                                "children": []
                            }
                        ]
                    },
                    {
                        "name": "升学类型",
                        "value": 201019,
                        "children": [
                            {
                                "name": "幼儿园入园",
                                "value": 201020,
                                "children": []
                            },
                            {
                                "name": "幼升小",
                                "value": 201021,
                                "children": []
                            },
                            {
                                "name": "小升初",
                                "value": 201022,
                                "children": []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "行业",
        "value": 201035,
        "children": [
            {
                "name": "通用行业",
                "value": 201036,
                "children": []
            },
            {
                "name": "IT互联网",
                "value": 201037,
                "children": [
                    {
                        "name": "产品经理",
                        "value": 201038,
                        "children": [
                            {
                                "name": "产品经理",
                                "value": 201039,
                                "children": []
                            },
                            {
                                "name": "用户产品经理",
                                "value": 201040,
                                "children": []
                            },
                            {
                                "name": "商业产品经理",
                                "value": 201041,
                                "children": []
                            }
                        ]
                    },
                    {
                        "name": "互联网运营",
                        "value": 201046,
                        "children": [
                            {
                                "name": "新媒体运营",
                                "value": 201047,
                                "children": []
                            }
                        ]
                    },
                    {
                        "name": "设计师",
                        "value": 201060,
                        "children": [
                            {
                                "name": "平面设计师",
                                "value": 201061,
                                "children": []
                            }
                        ]
                    },
                    {
                        "name": "开发研发",
                        "value": 201077,
                        "children": [
                            {
                                "name": "Java",
                                "value": 201078,
                                "children": []
                            },
                            {
                                "name": "Python",
                                "value": 201080,
                                "children": []
                            },
                            {
                                "name": "Web前端",
                                "value": 201087,
                                "children": []
                            },
                            {
                                "name": "Ruby",
                                "value": 201088,
                                "children": []
                            }
                        ]
                    },
                    {
                        "name": "测试工程师",
                        "value": 201106,
                        "children": [
                            {
                                "name": "测试工程师",
                                "value": 201107,
                                "children": []
                            }
                        ]
                    },
                    {
                        "name": "运维工程师",
                        "value": 201108,
                        "children": [
                            {
                                "name": "运维工程师",
                                "value": 201109,
                                "children": []
                            }
                        ]
                    },
                    {
                        "name": "数据分析师",
                        "value": 201110,
                        "children": [
                            {
                                "name": "数据分析师",
                                "value": 201111,
                                "children": []
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

const Tree = (props: { data: any }) => {
    return (
        <div>
            {
                props.data.map((item: any, index: number) => <div key={index} style={{ paddingLeft: "30px", display: "flex" }}>
                    {item.name}
                    {item.children && <Tree data={item.children} />}
                </div>)
            }
        </div>
    )
};

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
                        <Tree data={test} />
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