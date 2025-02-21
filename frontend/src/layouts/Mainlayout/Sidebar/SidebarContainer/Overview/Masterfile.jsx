import { useTheme } from "@mui/material"
import StyledCollapsedButton from "../../../../../components/StyledListItemButton/StyledCollpasedButton/StyledCollpasedButton";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownTwoToneIcon from '@mui/icons-material/ArrowDropDownTwoTone';
import { useEffect, useRef, useState } from "react";
import Collapsebtn from "../../../../../components/StyledListItemButton/CustomCollapseListButton/Collapsebtn";
import ListBtn from "../../../../../components/StyledListItemButton/CustomCollapseListButton/ListBtn";
import StyledPopover from "../../../../../components/StyledPopover";
import CustomMenuButton from "../../../../../components/CustomMenuButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { COLOR_ACCOUNTING, COLOR_ADMINISTRATIVE, COLOR_CASHIERPORTAL, COLOR_FINANCIALREPORT, COLOR_MASTERFILE, OPEN_ADMINISTRATIVE, OPEN_FIELD_DEVICE, OPEN_MASTERFILE, OPEN_OFFLINEMODE, OPEN_PH_NF_JP_DEVICE, OPEN_TRANSACTION } from "../../../../../store/actions";
import { SvgIconColors } from "../../../../../themes/palette";

const MasterFile = () => {
    const theme = useTheme();
    const sideActiveColor = SvgIconColors(theme.palette.appSettings)
    const open = useSelector((state) => state.customization.openMasterFile);
    const activateColor = useSelector((state) => state.customization.colorMasterFile)
    const dispatch = useDispatch();
    const [anchorHere, setAnchorHere] = useState(null)
    const popoverRef = useRef(null)
    const openBool = Boolean(anchorHere);
    const id = 'mouse-over-popover'

    const navigate = useNavigate()
    // masterfile
    const navigateGroupLine = () => { navigate('/dashboard/group-line'), colorCollapseBtn() }
    const navigateEmployeeList = () => { navigate('/dashboard/employee-list'), colorCollapseBtn() }
    const navigateDayType = () => { navigate('/dashboard/day-type'), colorCollapseBtn() }
    const navigateFieldList = () => { navigate('/dashboard/field-list'), colorCollapseBtn() }
    const navigateActivityList = () => { navigate('/dashboard/activity-list'), colorCollapseBtn() }
    const navigateGLCodeList = () => { navigate('/dashboard/gl-code'), colorCollapseBtn() }
    const navigateCostCenterList = () => { navigate('/dashboard/cost-center'), colorCollapseBtn() }
    const navigateLocationList = () => { navigate('/dashboard/location-list'), colorCollapseBtn() }
    const navigateDepartmentList = () => { navigate('/dashboard/department-list'), colorCollapseBtn() }
    const navigateClientList = () => { navigate('/dashboard/client-list'), colorCollapseBtn() }
    const navigateAccountMasterList = () => { navigate('/dashboard/account-master'), colorCollapseBtn() }

    const openCollapseBtn = () => {
        dispatch({ type: OPEN_MASTERFILE, openMasterFile: !open });
        dispatch({ type: OPEN_TRANSACTION, openTransaction: false });
        dispatch({ type: OPEN_ADMINISTRATIVE, openAdministrative: false  });
        dispatch({ type: OPEN_OFFLINEMODE, openOfflineMode: false });
        dispatch({ type: OPEN_FIELD_DEVICE, openFieldDevice: false });
        dispatch({ type: OPEN_PH_NF_JP_DEVICE, openPHNFJPDevice: false });
    }

    const colorCollapseBtn = () => {
        dispatch({ type: COLOR_MASTERFILE, colorMasterFile: true });
        dispatch({ type: COLOR_ACCOUNTING, colorAccounting: false });
        dispatch({ type: COLOR_CASHIERPORTAL, colorCashierPortal: false });
        dispatch({ type: COLOR_FINANCIALREPORT, colorFinancialReport: false });
        dispatch({ type: COLOR_ADMINISTRATIVE, colorAdministrative: false });
    }

    useEffect(() => {
        if (location.pathname === '/dashboard/group-line'
            || location.pathname === '/dashboard/employee-list'
            || location.pathname === '/dashboard/day-type'
            || location.pathname === '/dashboard/field-list'
            || location.pathname === '/dashboard/activity-list'
            || location.pathname === '/dashboard/gl-code'
            || location.pathname === '/dashboard/cost-center'
            || location.pathname === '/dashboard/location-list'
            || location.pathname === '/dashboard/department-list'
            || location.pathname === '/dashboard/account-master'
        ) {
            dispatch({ type: COLOR_ADMINISTRATIVE, colorMasterFile: true });
        } else {
            dispatch({ type: COLOR_ADMINISTRATIVE, colorMasterFile: false });
        }
    }, [dispatch]);

    const handleOpenCollapse = (event) => {
        setAnchorHere(event.currentTarget)
    }

    const HandlecloseCollapse = () => {
        if (popoverRef.current && popoverRef.current.contains(event.relatedTarget)) {
            return;
        }
        setAnchorHere(null)
    }

    const blackFunc = () => { };
    return (
        <>
            <StyledCollapsedButton
                id={id}
                onClick={openCollapseBtn}
                IconChildren={<AdminPanelSettingsIcon fontSize="small" />}
                CollpaseBtnLabels="Masterfile"
                handlePopoverOpen={theme.palette.appSettings.layout === 'vertical' ? blackFunc : handleOpenCollapse}
                handlePopoverClose={HandlecloseCollapse}
                bgcolor={activateColor ? `${sideActiveColor.svgcolor[600]}` : 'none'}
                iconcolor={activateColor ? `${sideActiveColor.svgcolor[100]}` : '#637381'}
            >
                {open ?
                    <ArrowDropDownTwoToneIcon sx={{ display: theme.palette.appSettings.layout === 'collapsed' ? 'none' : theme.palette.appSettings.layout === 'horizontal' ? 'none' : 'flex' }} /> :
                    <ArrowRightIcon sx={{ display: theme.palette.appSettings.layout === 'collapsed' ? 'none' : theme.palette.appSettings.layout === 'horizontal' ? 'none' : 'flex' }} />
                }
                <ArrowDropDownTwoToneIcon sx={{ display: theme.palette.appSettings.layout === 'collapsed' ? 'none' : theme.palette.appSettings.layout === 'horizontal' ? 'flex' : 'none' }} />
            </StyledCollapsedButton>
            <StyledPopover
                id={id}
                open={openBool}
                anchorEl={anchorHere}
                onMouseLeave={HandlecloseCollapse}
                onMouseEnter={openCollapseBtn}
                popoverRef={popoverRef}
                menuButton={
                    <>
                        <CustomMenuButton
                            label="Employee List"
                            activePath="/dashboard/employee-list"
                            onClick={navigateEmployeeList}
                        />
                        <CustomMenuButton
                            label="Account Master List"
                            activePath="/dashboard/account-master"
                            onClick={navigateAccountMasterList}
                        />
                        <CustomMenuButton
                            label="Group / Line List"
                            activePath="/dashboard/group-line"
                            onClick={navigateGroupLine}
                        />
                        <CustomMenuButton
                            label="Day Type List"
                            activePath="/dashboard/day-type"
                            onClick={navigateDayType}
                        />
                        <CustomMenuButton
                            label="Field List"
                            activePath="/dashboard/field-list"
                            onClick={navigateFieldList}
                        />
                        <CustomMenuButton
                            label="Activity List"
                            activePath="/dashboard/activity-list"
                            onClick={navigateActivityList}
                        />
                        <CustomMenuButton
                            label="GL Code List"
                            activePath="/dashboard/gl-code"
                            onClick={navigateGLCodeList}
                        />
                        <CustomMenuButton
                            label="Cost Center List"
                            activePath="/dashboard/cost-center"
                            onClick={navigateCostCenterList}
                        />
                        <CustomMenuButton
                            label="Location List"
                            activePath="/dashboard/location-list"
                            onClick={navigateLocationList}
                        />
                        <CustomMenuButton
                            label="Department List"
                            activePath="/dashboard/department-list"
                            onClick={navigateDepartmentList}
                        />
                    </>
                }
            />
            <Collapsebtn stateOpen={open}>
                <ListBtn
                    label="Employee List"
                    activePath="/dashboard/employee-list"
                    onClick={navigateEmployeeList}
                />
                <ListBtn
                    label="Account Master List"
                    activePath="/dashboard/account-master"
                    onClick={navigateAccountMasterList}
                />
                <ListBtn
                    label="Group / Line List"
                    activePath="/dashboard/group-line"
                    onClick={navigateGroupLine}
                />
                <ListBtn
                    label="Day Type List"
                    activePath="/dashboard/day-type"
                    onClick={navigateDayType}
                />
                <ListBtn
                    label="Field List"
                    activePath="/dashboard/field-list"
                    onClick={navigateFieldList}
                />
                <ListBtn
                    label="Activity List"
                    activePath="/dashboard/activity-list"
                    onClick={navigateActivityList}
                />
                <ListBtn
                    label="GL Code List"
                    activePath="/dashboard/gl-code"
                    onClick={navigateGLCodeList}
                />
                <ListBtn
                    label="Cost Center List"
                    activePath="/dashboard/cost-center"
                    onClick={navigateCostCenterList}
                />
                <ListBtn
                    label="Location List"
                    activePath="/dashboard/location-list"
                    onClick={navigateLocationList}
                />
                <ListBtn
                    label="Department List"
                    activePath="/dashboard/department-list"
                    onClick={navigateDepartmentList}
                />
                <ListBtn
                    label="Client List"
                    activePath="/dashboard/client-list"
                    onClick={navigateClientList}
                />
            </Collapsebtn>
        </>
    )
}

export default MasterFile