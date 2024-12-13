import Loadable from "@/components/custom/LazyLoader/Loadable";
import { useAuth } from "@/context/AuthContext";
import { lazy } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";

const DashboardLayout = Loadable(lazy(() => import('@/layout/DashboardLayout')));
const SignInPage = Loadable(lazy(() => import('@/pages/auth/signin')));

// MASTERFILE
const EmployeeList = Loadable(lazy(() => import('@/pages/masterfile/employee_list')));
const ActivityList = Loadable(lazy(() => import('@/pages/masterfile/activity_list')));
const FieldList = Loadable(lazy(() => import('@/pages/masterfile/field_list')));
const CostCenterList = Loadable(lazy(() => import('@/pages/masterfile/cost_center_list')));
const GLAccountList = Loadable(lazy(() => import('@/pages/masterfile/gl_accout_list')));
const LocationList = Loadable(lazy(() => import('@/pages/masterfile/location_list')));
// ENDS HERE

export default function AppRouter() {
    const { accessToken } = useAuth();
    const dashboardRoutes = [
        {
            path: '/',
            element: accessToken ? (
                <DashboardLayout>
                        <Outlet />
                </DashboardLayout>
            ) : (
                ''
            ),
            children: [
                {
                    path: '/dashboard/employee-list',
                    element: <EmployeeList />
                },
                {
                    path: '/dashboard/activity-list',
                    element: <ActivityList />
                },
                {
                    path: '/dashboard/field-list',
                    element: <FieldList />
                },
                {
                    path: '/dashboard/cost-center-list',
                    element: <CostCenterList />
                },
                {
                    path: '/dashboard/gl-account-list',
                    element: <GLAccountList />
                },
                {
                    path: '/dashboard/location-list',
                    element: <LocationList />
                }

            ],
        }
    ];

    const publicRoutes = [
        {
            path: '/login',
            element: !accessToken ? <SignInPage /> : <Navigate to="/" />,
            index: true,
        }
    ];

    const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

    return routes;
}
