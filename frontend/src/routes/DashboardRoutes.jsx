import { lazy } from "react"
import Loadable from '../components/Loadable/Loadable'
const MainLayout = Loadable(lazy(() => import('../layouts/Mainlayout/MainLayout')));
const Dashboard = Loadable(lazy(() => import('../views/dashboard/index')));

const UploadFinancialDocuments = Loadable(lazy(() => import('../views/_doumentupload/_upload_financial_documents')));
const UploadOfficeDocuments = Loadable(lazy(() => import('../views/_doumentupload/_upload_office_documents')));
const PayrollDocuments = Loadable(lazy(() => import('../views/_doumentupload/_upload_payroll_documents')));
const MiscellaneousDocuments = Loadable(lazy(() => import('../views/_doumentupload/_upload_miscellaneous')));
const UploadAOMDocuments = Loadable(lazy(() => import('../views/_doumentupload/_upload_aom_documents')));
const DocumentTypeList = Loadable(lazy(() => import('../views/Administrative/_DocumentType_List')));
const ScannerList = Loadable(lazy(() => import('../views/Administrative/_ScannerList')));
const UserList = Loadable(lazy(() => import('../views/Administrative/_UserList')));
const DepartmentList = Loadable(lazy(() => import('../views/Administrative/_DepartmentList')));
const InquiryPreview = Loadable(lazy(() => import('../views/_inquiry')));
const SystemLogs = Loadable(lazy(() => import('../views/Administrative/_eRas_Logs')));

const AccessDenied = Loadable(lazy(() => import('../components/Page403/accessDenied')));
const PageNotFound = Loadable(lazy(() => import('../components/Page404/pageNotFound')));
import ProtectedRoute from './ProtectedRoute';
const UpdateFormPass = Loadable(lazy(() => import('../views/authentication/update-password/updatepass-container')));


// masterfile
const GroupLineList = Loadable(lazy(() => import('../views/masterfile/group_line')));

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
				<ProtectedRoute pageName='My Portal'>
					<GroupLineList />
				</ProtectedRoute>
			)
		},

		{
			path: '/dashboard/upload-financial-documents',
			element: (
				<ProtectedRoute pageName='Financial Documents'>
					<UploadFinancialDocuments />
				</ProtectedRoute>
			)
		},


		{
			path: '/dashboard/upload-office-documents',
			element: (
				<ProtectedRoute pageName='Office Documents'>
					<UploadOfficeDocuments />
				</ProtectedRoute>
			)
		},


		{
			path: '/dashboard/upload-payroll-documents',
			element: (
				<ProtectedRoute pageName='Payroll Documents'>
					<PayrollDocuments />
				</ProtectedRoute>
			)
		},

		{
			path: '/dashboard/upload-miscellaneous-documents',
			element: (
				<ProtectedRoute pageName='Misc Documents'>
					<MiscellaneousDocuments />
				</ProtectedRoute>
			)
		},

		{
			path: '/dashboard/upload-aom-documents',
			element: (
				<ProtectedRoute pageName='AOM Documents'>
					<UploadAOMDocuments />
				</ProtectedRoute>
			)
		},

		{
			path: '/dashboard/document-type-list',
			element: (
				<ProtectedRoute pageName='Doc Type List'>
					<DocumentTypeList />
				</ProtectedRoute>
			)
		},

		{
			path: '/dashboard/scanner-list',
			element: (
				<ProtectedRoute pageName='Scanner List'>
					<ScannerList />
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
			path: '/dashboard/department-list',
			element: (
				<ProtectedRoute pageName='Department List'>
					<DepartmentList />
				</ProtectedRoute>
			)
		},

		{
			path: '/dashboard/inquiry',
			element: (
				<ProtectedRoute pageName='Inquiry'>
					<InquiryPreview />
				</ProtectedRoute>
			)
		},

		{
			path: '/dashboard/logs',
			element: (
				<ProtectedRoute pageName='Logs'>
					<SystemLogs />
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