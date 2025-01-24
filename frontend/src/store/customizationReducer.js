
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
    openTransaction: false,
    openOfflineMode: false,
    openFieldDevice: false,
    openPHNFJPDevice: false,
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
    openCustomHeaderModal: false,
    formHeaderData: {},
    openCustomSearchModal: false,
    searchSelectedData: {},
    openNewDar: false,

    // common
    confirmDelete: false,
    swalConfirmation: false,
    isUpdateForm: false,
    isUpdateHeaderForm: false,
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
        case actionTypes.OPEN_CUSTOM_HEADER_MODAL:
            return {
                ...state,
                openCustomHeaderModal: action.openCustomHeaderModal
            };
        case actionTypes.FORM_HEADER_DATA:
            return {
                ...state,
                formHeaderData: action.formHeaderData
            };
        case actionTypes.OPEN_CUSTOM_SEARCH_MODAL:
            return {
                ...state,
                openCustomSearchModal: action.openCustomSearchModal
            };
        case actionTypes.SEARCH_SELECTED_DATA:
            return {
                ...state,
                searchSelectedData: action.searchSelectedData
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
        case actionTypes.IS_UPDATE_HEADER_FORM:
            return {
                ...state,
                isUpdateHeaderForm: action.isUpdateHeaderForm
            };

        case actionTypes.OPEN_TRANSACTION:
            return {
                ...state,
                openTransaction: action.openTransaction
            };
        case actionTypes.OPEN_OFFLINEMODE:
            return {
                ...state,
                openOfflineMode: action.openOfflineMode
            };
        case actionTypes.OPEN_FIELD_DEVICE:
            return {
                ...state,
                openFieldDevice: action.openFieldDevice
            };
        case actionTypes.OPEN_PH_NF_JP_DEVICE:
            return {
                ...state,
                openPHNFJPDevice: action.openPHNFJPDevice
            };
        case actionTypes.OPEN_NEW_DAR:
            return {
                ...state,
                openNewDar: action.openNewDar
            };
        default:
            return state;
    }
};

export default customizationReducer;
