import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { useLocation, Link } from "react-router-dom";

const DynamicBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter((segment) => segment);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSegments.length - 1;

    return (
      <React.Fragment key={path}>
        <BreadcrumbItem className="hidden md:block">
          {isLast ? (
            <span>{decodeURIComponent(segment)}</span>
          ) : (
            <Link to={path}>
              <BreadcrumbLink className="text-sm">{decodeURIComponent(segment)}</BreadcrumbLink>
            </Link>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator className="hidden md:block" text-sm />}
      </React.Fragment>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumbs;
