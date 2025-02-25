import { lazy } from "react"
import Loadable from '../components/Loadable/Loadable'
import UpdateExportEmployeeLocation from "../views/PH/NF/JP_Device_Process";
import BatchingDar from "../views/Batching/BatchingDar";
import AccessRightsRoutes from "./AccessRightsRoutes";
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
				<Dashboard />
			)
		},
		// masterfile
		{
			path: '/dashboard/employee-list',
			element: (
				<AccessRightsRoutes element={<EmployeeList />} requiredFormID={1} />
			)
		},
		{
			path: '/dashboard/account-master',
			element: (
				<AccessRightsRoutes element={<AccountMasterList />} requiredFormID={1} />
			)
		},
		{
			path: '/dashboard/group-line',
			element: (
				<AccessRightsRoutes element={<GroupLineList />} requiredFormID={3} />
			)
		},	
		{
			path: '/dashboard/day-type',
			element: (
					<AccessRightsRoutes element={<DayTypeList />} requiredFormID={4} />
			)
		},
		{
			path: '/dashboard/field-list',
			element: (
					<AccessRightsRoutes element={<FieldList />} requiredFormID={5} />
			)
		},
		{
			path: '/dashboard/activity-list',
			element: (
					<AccessRightsRoutes element={<ActivityList />} requiredFormID={6} />
			)
		},
		{
			path: '/dashboard/gl-code',
			element: (
					<AccessRightsRoutes element={<GLCodeList />} requiredFormID={7} />
			)
		},
		{
			path: '/dashboard/cost-center',
			element: (
					<AccessRightsRoutes element={<CostCenterList />} requiredFormID={8} />
			)
		},
		{
			path: '/dashboard/location-list',
			element: (
					<AccessRightsRoutes element={<LocationList />} requiredFormID={9} />
			)
		},
		{
			path: '/dashboard/department-list',
			element: (
					<AccessRightsRoutes element={<DepartmentList />} requiredFormID={10} />
			)
		},
		{
			path: '/dashboard/client-list',
			element: (
					<AccessRightsRoutes element={<ClientList />} requiredFormID={11} />
			)
		},

		// transaction
		{
			path: '/dashboard/employee-templates',
			element: (
					<AccessRightsRoutes element={<EmployeeTemplates />} requiredFormID={12} />
			)
		},
		{
			path: '/dashboard/account-rate',
			element: (
					<AccessRightsRoutes element={<AccountRate />} requiredFormID={13} />
			)
		},
		{
			path: '/dashboard/dar-preparation',
			element: (
					<AccessRightsRoutes element={<DARPreparation />} requiredFormID={14} />
			)
		},
		{
			path: '/dashboard/soa-creation',
			element: (
					<AccessRightsRoutes element={<SOACreation />} requiredFormID={15} />
			)
		},
		// administrative
		{
			path: '/dashboard/user-list',
			element: (
					<AccessRightsRoutes element={<UserList />} requiredFormID={16} />
			)
		},
		{
			path: '/dashboard/signatories',
			element: (
					<AccessRightsRoutes element={<SignatoryList />} requiredFormID={17} />
			)
		},
		// PH/NF/JP DeviceProcess
		{
			path: '/dashboard/update-employee-location',
			element: (
					<UpdateExportEmployeeLocation/>
			)
		},


		// BATCHING
		{
			path: '/dashboard/batching-dar',
			element: (
					<BatchingDar/>
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