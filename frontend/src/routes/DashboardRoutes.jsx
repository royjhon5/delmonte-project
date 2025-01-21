import { lazy } from "react"
import Loadable from '../components/Loadable/Loadable'
import ProtectedRoute from './ProtectedRoute'

const MainLayout = Loadable(lazy(() => import('../layouts/Mainlayout/MainLayout')));
const Dashboard = Loadable(lazy(() => import('../views/dashboard/index')));

const AccessDenied = Loadable(lazy(() => import('../components/Page403/accessDenied')));
const PageNotFound = Loadable(lazy(() => import('../components/Page404/pageNotFound')));
const UpdateFormPass = Loadable(lazy(() => import('../views/authentication/update-password/updatepass-container')));

// masterfile
const GroupLineList = Loadable(lazy(() => import('../views/Masterfile/group_line')));
const EmployeeList = Loadable(lazy(() => import('../views/Masterfile/employee_list')));
const DayTypeList = Loadable(lazy(() => import('../views/Masterfile/day_type')));
// administrative
const UserList = Loadable(lazy(() => import('../views/Administrative/_UserList')));

const DashboardRoutes = {
	path: '/',
	element: <MainLayout />,
	children: [
		{
			path: '/dashboard',
			element: (
				<ProtectedRoute pageName='Dashboard'>
					<Dashboard />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/group-line',
			element: (
				<ProtectedRoute pageName='Group Line'>
					<GroupLineList />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/employee-list',
			element: (
				<ProtectedRoute pageName='Employee List'>
					<EmployeeList />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/day-type',
			element: (
				<ProtectedRoute pageName='Day Type'>
					<DayTypeList />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/user-list',
			element: (
				<ProtectedRoute pageName='User List'>
					<UserList />
				</ProtectedRoute>
			)
		},

		{
			path: '/access-denied',
			element: <AccessDenied />
		},

		{
			path: '/dashboard/change-password',
			element: <UpdateFormPass />
		},

		{
			path: '*',
			element: <PageNotFound />
		},
	]
}

export default DashboardRoutes