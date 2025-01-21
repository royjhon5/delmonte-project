
import * as actionTypes from './actions';

const getBorderRadiusFromLocalStorage = () => {
    const storedBorderRadius = localStorage.getItem('borderRadius');
    return storedBorderRadius ? parseInt(storedBorderRadius, 10) : 4;
};

export const initialState = {
    isOpen: [],
    defaultId: 'default',
    borderRadius: getBorderRadiusFromLocalStorage(),
    opened: false,
    openNotif: false,
    openSidebarMobile: false,

    openMasterFile: false,
    openAccounting: false,
    openCashierPortal: false,
    openFinancialReport: false,
    openAdministrative: false,

    colorMasterFile: false,
    colorAccounting: false,
    colorCashierPortal: false,
    colorFinancialReport: false,
    colorAdministrative: false,

    // masterfile
    openCustomModal: false,
    formData: {},

    // common
    confirmDelete: false,
    swalConfirmation: false,
    isUpdateForm: false,
};

const customizationReducer = (state = initialState, action) => {
    let id;
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
        case actionTypes.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.OPEN_NOTIF:
            return {
                ...state,
                openNotif: action.openNotif
            };
        case actionTypes.OPEN_SIDEBAR_MOBILE:
            return {
                ...state,
                openSidebarMobile: action.openSidebarMobile
            };
        case actionTypes.SET_FONT_FAMILY:
            return {
                ...state,
                fontFamily: action.fontFamily
            };
        case actionTypes.SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: action.borderRadius
            };
        case actionTypes.SET_OPEN_NEWCASH_VOUCHER:
            return {
                ...state,
                openNewCashVoucher: action.openNewCashVoucher
            };
        // FOR OPENING AND CLOSING COLLAPSE BUTTONS
        case actionTypes.OPEN_MASTERFILE:
            return {
                ...state,
                openMasterFile: action.openMasterFile
            };
        case actionTypes.OPEN_ACCOUNTING:
            return {
                ...state,
                openAccounting: action.openAccounting
            };
        case actionTypes.OPEN_CASHIERPORTAL:
            return {
                ...state,
                openCashierPortal: action.openCashierPortal
            };
        case actionTypes.OPEN_FINANCIALREPORT:
            return {
                ...state,
                openFinancialReport: action.openFinancialReport
            };
        case actionTypes.OPEN_ADMINISTRATIVE:
            return {
                ...state,
                openAdministrative: action.openAdministrative
            };
        // ENDS HERE

        //CHANGING COLLPASE BUTTON CCOLOR
        case actionTypes.COLOR_MASTERFILE:
            return {
                ...state,
                colorMasterFile: action.colorMasterFile
            };
        case actionTypes.COLOR_ACCOUNTING:
            return {
                ...state,
                colorAccounting: action.colorAccounting
            };
        case actionTypes.COLOR_CASHIERPORTAL:
            return {
                ...state,
                colorCashierPortal: action.colorCashierPortal
            };
        case actionTypes.COLOR_FINANCIALREPORT:
            return {
                ...state,
                colorFinancialReport: action.colorFinancialReport
            };
        case actionTypes.COLOR_ADMINISTRATIVE:
            return {
                ...state,
                colorAdministrative: action.colorAdministrative
            };
        // ENDS HERE

        // MASTERFILE
        case actionTypes.OPEN_CUSTOM_MODAL:
            return {
                ...state,
                openCustomModal: action.openCustomModal
            };
        case actionTypes.FORM_DATA:
            return {
                ...state,
                formData: action.formData
            };

        // COMMON
        case actionTypes.OPEN_DELETESWAL:
            return {
                ...state,
                confirmDelete: action.confirmDelete
            };
        case actionTypes.OPEN_SWALCONFIRMATION:
            return {
                ...state,
                swalConfirmation: action.swalConfirmation
            };
        case actionTypes.IS_UPDATE_FORM:
            return {
                ...state,
                isUpdateForm: action.isUpdateForm
            };


        default:
            return state;
    }
};

export default customizationReducer;
