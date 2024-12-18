"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  LayoutDashboard,
  ScanLine,
  Shield,
  SquareTerminal,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
// import { NavProjects } from "./nav-projects"
import { NavUser } from "./user-nav"


// This is sample data.
const data = {
  user: {
    name: "gsmpc",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "GSMPC",
      logo: GalleryVerticalEnd,
      plan: "e-DAR",
    },
  ],
  navMain: [
    {
      title: "Masterfile",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Employee List",
          url: "/dashboard/employee-list",
        },
        {
          title: "Activity List",
          url: "/dashboard/activity-list",
        },
        {
          title: "Field List",
          url: "/dashboard/field-list",
        },
        {
          title: "Cost Center List",
          url: "/dashboard/cost-center-list",
        },
        {
          title: "GL Account List",
          url: "/dashboard/gl-account-list",
        },
        {
          title: "Location / Department List",
          url: "/dashboard/location-list",
        },
      ],
    },
    {
      title: "Transaction",
      url: "#",
      icon: ScanLine,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Administrative",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Update Pack House Employee",
          url: "/dashboard/employee-masterfile",
        },
        {
          title: "Export Packhouse Employe List",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
      {/* <NavProjects projects={data.projects} /> */}
      <NavMain items={data.navMain} />     
      </SidebarContent>
      <SidebarFooter>
      {/* <NavUser user={data.user} /> */}
      <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
