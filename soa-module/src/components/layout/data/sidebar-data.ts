import {
  IconBarrierBlock,
  IconBug,
  IconComponents,
  IconCreditCardPay,
  IconDeviceMobile,
  IconError404,
  IconFileInfo,
  IconInfoHexagon,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconServerOff,
  IconUserOff,
  IconUserShield,
  IconWifiOff,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Roy Jhon Dev',
    email: 'royjhondev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Del Monte',
      logo: Command,
      plan: 'SOA Module',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Masterfile',
          icon: IconFileInfo,
          items: [
            {
              title: 'Employee List',
              url: '/masterfile/employee_list',
            },
            {
              title: 'Account to Change List',
              url: '/sign-in-2',
            },
            {
              title: 'Location List department List',
              url: '/sign-up',
            },
            {
              title: 'Day Type List',
              url: '/forgot-password',
            },
            {
              title: 'Field List',
              url: '/otp',
            },
            {
              title: 'Activity List',
              url: '/otp',
            },
            {
              title: 'GL Code List',
              url: '/otp',
            },
            {
              title: 'Cost Center List',
              url: '/otp',
            },
            {
              title: 'Location List',
              url: '/otp',
            },
            {
              title: 'Department List',
              url: '/masterfile/department_list',
            },
          ],
        },
        {
          title: 'Transaction',
          icon: IconCreditCardPay,
          items: [
            {
              title: 'Employee Templates - PH/NF-JP',
              url: '/sign-in',
            },
            {
              title: 'Rate Templates Client',
              url: '/sign-in-2',
            },
            {
              title: 'DAR Creation',
              url: '/sign-up',
            },
            {
              title: 'SOA Creation',
              url: '/forgot-password',
            },
          ],
        },
        {
          title: 'Administrative',
          icon: IconUserShield,
          items: [
            {
              title: 'Update / Export Packhouse Employee',
              url: '/administrative/update_employee',
            },
            {
              title: 'User List',
              url: '/sign-in',
            },      
          ],
        },
        // {
        //   title: 'Tasks',
        //   url: '/tasks',
        //   icon: IconChecklist,
        // },
        // {
        //   title: 'Apps',
        //   url: '/apps',
        //   icon: IconPackages,
        // },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: IconMessages,
        // },
        // {
        //   title: 'Users',
        //   url: '/users',
        //   icon: IconUsers,
        // },
      ],
    },
    {
      title: 'Data Upload',
      items: [
        {
          title: 'Offline Mode',
          icon: IconWifiOff,
          items: [
            {
              title: 'Export Data (Site to External Drive)',
              url: '/sign-in',
            },
            {
              title: 'Import (External Drive to Main Office)',
              url: '/sign-in-2',
            },
          ],
        },
        {
          title: 'Field Device Process',
          icon: IconDeviceMobile,
          items: [
            {
              title: 'Load Employee',
              url: '/sign-in',
            },
            {
              title: 'Upload Employee',
              url: '/sign-in-2',
            },
          ],
        },
        {
          title: 'PH/NF/JP Device Process',
          icon: IconComponents,
          items: [
            {
              title: 'Upload Employee Location',
              url: '/sign-in',
            },
            {
              title: 'Export Data',
              url: '/sign-in-2',
            },
          ],
        },
        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: IconBug,
          items: [
            {
              title: 'Unauthorized',
              url: '/401',
              icon: IconLock,
            },
            {
              title: 'Forbidden',
              url: '/403',
              icon: IconUserOff,
            },
            {
              title: 'Not Found',
              url: '/404',
              icon: IconError404,
            },
            {
              title: 'Internal Server Error',
              url: '/500',
              icon: IconServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/503',
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
    {
      title: 'Miscellaneous ',
      items: [
        // {
        //   title: 'Settings',
        //   icon: IconSettings,
        //   items: [
        //     {
        //       title: 'Profile',
        //       url: '/settings',
        //       icon: IconUserCog,
        //     },
        //     {
        //       title: 'Account',
        //       url: '/settings/account',
        //       icon: IconTool,
        //     },
        //     {
        //       title: 'Appearance',
        //       url: '/settings/appearance',
        //       icon: IconPalette,
        //     },
        //     {
        //       title: 'Notifications',
        //       url: '/settings/notifications',
        //       icon: IconNotification,
        //     },
        //     {
        //       title: 'Display',
        //       url: '/settings/display',
        //       icon: IconBrowserCheck,
        //     },
        //   ],
        // },
        // {
        //   title: 'Help Center',
        //   url: '/help-center',
        //   icon: IconHelp,
        // },
        {
          title: 'User Manual',
          url: '/help-center',
          icon: IconInfoHexagon,
        },
      ],
    },
  ],
}
