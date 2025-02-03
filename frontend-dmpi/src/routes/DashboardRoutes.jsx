import { lazy } from "react"
import Loadable from '../components/Loadable/Loadable'
import ProtectedRoute from './ProtectedRoute'
import UpdateExportEmployeeLocation from "../views/PH/NF/JP_Device_Process";
const MainLayout = Loadable(lazy(() => import('../layouts/Mainlayout/MainLayout')));
const Dashboard = Loadable(lazy(() => import('../views/dashboard/index')));

const AccessDenied = Loadable(lazy(() => import('../components/Page403/accessDenied')));
const PageNotFound = Loadable(lazy(() => import('../components/Page404/pageNotFound')));
const UpdateFormPass = Loadable(lazy(() => import('../views/authentication/update-password/updatepass-container')));

// masterfile
const GroupLineList = Loadable(lazy(() => import('../views/Masterfile/group_line')));
const EmployeeList = Loadable(lazy(() => import('../views/Masterfile/employee_list')));
const DayTypeList = Loadable(lazy(() => import('../views/Masterfile/day_type')));
const FieldList = Loadable(lazy(() => import('../views/Masterfile/field_list')));
const ActivityList = Loadable(lazy(() => import('../views/Masterfile/activity_list')));
const GLCodeList = Loadable(lazy(() => import('../views/Masterfile/gl_code')));
const CostCenterList = Loadable(lazy(() => import('../views/Masterfile/cost_center')));
const LocationList = Loadable(lazy(() => import('../views/Masterfile/location_list')));
const DepartmentList = Loadable(lazy(() => import('../views/Masterfile/department_list')));
const ClientList = Loadable(lazy(() => import('../views/Masterfile/client_list')));
const AccountMasterList = Loadable(lazy(() => import('../views/Masterfile/account_master')));

// transaction
const EmployeeTemplates = Loadable(lazy(() => import('../views/Transaction/employee_templates')));
const AccountRate = Loadable(lazy(() => import('../views/Transaction/account_rate')));
const DARPreparation = Loadable(lazy(() => import('../views/Transaction/dar_creation')));
const SOACreation = Loadable(lazy(() => import('../views/Transaction/soa_creation')));

// administrative
const UserList = Loadable(lazy(() => import('../views/Administrative/_UserList')));
const SignatoryList = Loadable(lazy(() => import('../views/Administrative/Signatory')));


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
		// masterfile
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
			path: '/dashboard/field-list',
			element: (
				<ProtectedRoute pageName='Field List'>
					<FieldList />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/activity-list',
			element: (
				<ProtectedRoute pageName='Activity List'>
					<ActivityList />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/gl-code',
			element: (
				<ProtectedRoute pageName='GL Code'>
					<GLCodeList />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/cost-center',
			element: (
				<ProtectedRoute pageName='Cost Center'>
					<CostCenterList />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/location-list',
			element: (
				<ProtectedRoute pageName='Location List'>
					<LocationList />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/department-list',
			element: (
				<ProtectedRoute pageName='Department List'>
					<DepartmentList />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/client-list',
			element: (
				<ProtectedRoute pageName='Client List'>
					<ClientList />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/account-master',
			element: (
				<ProtectedRoute pageName='Account Master'>
					<AccountMasterList />
				</ProtectedRoute>
			)
		},
		// transaction
		{
			path: '/dashboard/employee-templates',
			element: (
				<ProtectedRoute pageName='User List'>
					<EmployeeTemplates />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/account-rate',
			element: (
				<ProtectedRoute pageName='Account Rate'>
					<AccountRate />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/dar-preparation',
			element: (
				<ProtectedRoute pageName='User List'>
					<DARPreparation />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/soa-creation',
			element: (
				<ProtectedRoute pageName='User List'>
					<SOACreation />
				</ProtectedRoute>
			)
		},
		// administrative
		{
			path: '/dashboard/user-list',
			element: (
				<ProtectedRoute pageName='User List'>
					<UserList />
				</ProtectedRoute>
			)
		},
		{
			path: '/dashboard/signatories',
			element: (
				<ProtectedRoute pageName='User List'>
					<SignatoryList />
				</ProtectedRoute>
			)
		},
		// PH/NF/JP DeviceProcess
		{
			path: '/dashboard/update-employee-location',
			element: (
				<ProtectedRoute pageName='User List'>
					<UpdateExportEmployeeLocation/>
				</ProtectedRoute>
			)
		},
		// others
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