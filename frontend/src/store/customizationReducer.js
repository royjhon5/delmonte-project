
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

  openNewCashVoucher: false,
  openAddNewCompany: false,
  openAddPayee: false,
  openSaveNewPayee: false,
  toUpdatePayee: false,
  confirmDelete: false,
  isCheckPayee: false,
  isUpdateCashVoucher: false,
  openVoucherSelection: false,
  openSubcodeSelection: false,
  openCompanyBranchSelection: false,
  swalConfirmation: false,
  changeSwalEnv: false,
  openSubDocument: false,
  openAddScanner: false,
  isToUpdateScanner: false,
  openDepartment: false,
  isToUpdateDepartment: false,
  openSearchViaKeyword: false,
  openCreateNewFolder: false,
  isToUpdateFolder: false,
  folderData: {},
  openCreateSubNewFolder: false,
  isToUpdateSubFolder: false,
  SubfolderData: {},
  openArchiveByCat: false,
  openArchiveByDept: false,
  openSummaryDocType: false,
  openCOATransmittalReport: false,
  passIdlink: 0,
  openCreateNewFile: false,
  pass_SubIdLink: 0,
  isToUpdateFiles: false,
  filesDataObj: {},
  departmentData: {},
  companyData: {},
  scannerData: {},
  documentTypeData: {},
  supplierData: {},
  passData: {},
  specificData: {},
  cashvoucherData: {}, 
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
    // CASH VOUCHER ACTIONS
    case actionTypes.OPEN_NEWCASHVOUCHER:
        return {
          ...state,
          openNewCashVoucher: action.openNewCashVoucher
        };
    case actionTypes.OPEN_ADDNEWCOMPANY:
      return {
        ...state,
        openAddNewCompany: action.openAddNewCompany
      };
    case actionTypes.PASS_COMPANYDETAILS:
    return {
      ...state,
      companyData: action.companyData
    };
    case actionTypes.OPEN_ADDPAYEE:
    return {
      ...state,
      openAddPayee: action.openAddPayee
    };
    //ENDS HERE

    //EXTERNAL GLOBA USAGE 
    case actionTypes.OPEN_SAVENEWPAYEE:
    return {
      ...state,
      openSaveNewPayee: action.openSaveNewPayee
    };
    case actionTypes.OPEN_TOUPDATEPAYEE:
    return {
      ...state,
      toUpdatePayee: action.toUpdatePayee
    };
    case actionTypes.PASS_SUPPLIERDETAILS:
    return {
      ...state,
      supplierData: action.supplierData
    };
    case actionTypes.OPEN_DELETESWAL:
    return {
      ...state,
      confirmDelete: action.confirmDelete
    };
    case actionTypes.PASS_DATA:
    return {
      ...state,
      passData: action.passData
    };
    case actionTypes.IS_CHECKPAYEE:
    return {
      ...state,
      isCheckPayee: action.isCheckPayee
    };
    case actionTypes.PASS_SPECIFIC:
    return {
      ...state,
      specificData: action.specificData
    };
    case actionTypes.CASHVOUCHER_DATA:
    return {
      ...state,
      cashvoucherData: action.cashvoucherData
    };
    case actionTypes.IS_UPDATECASHVOUCHER:
    return {
      ...state,
      isUpdateCashVoucher: action.isUpdateCashVoucher
    };
    case actionTypes.OPEN_VOUCHERSELECTION:
    return {
      ...state,
      openVoucherSelection: action.openVoucherSelection
    };
    case actionTypes.OPEN_SUBCODESELECTION:
    return {
      ...state,
      openSubcodeSelection: action.openSubcodeSelection
    };
    case actionTypes.OPEN_COMPANYBRANCHSELECTION:
    return {
      ...state,
      openCompanyBranchSelection: action.openCompanyBranchSelection
    };
    case actionTypes.OPEN_SWALCONFIRMATION:
    return {
      ...state,
      swalConfirmation: action.swalConfirmation
    };
    case actionTypes.CHANGE_SWAL_ENV:
    return {
      ...state,
      changeSwalEnv: action.changeSwalEnv
    };
    case actionTypes.OPEN_SEARCH_ECARDING:
    return {
      ...state,
      openSearchEcarding: action.openSearchEcarding
    };
    //ENDS HERE

    case actionTypes.OPEN_SUBDOCUMENT:
    return {
      ...state,
      openSubDocument: action.openSubDocument
    };

    case actionTypes.DOCUMENT_TYPEOBJ:
    return {
      ...state,
      documentTypeData: action.documentTypeData
    };

    case actionTypes.OPEN_ADDSCANNER:
      return {
        ...state,
        openAddScanner: action.openAddScanner
      };

    case actionTypes.SCANNER_TYPEOBJ:
      return {
        ...state,
        scannerData: action.scannerData
      };

    case actionTypes.ISTOUPDATE_SCANNER:
      return {
        ...state,
        isToUpdateScanner: action.isToUpdateScanner
    };

    case actionTypes.OPEN_ADDDEPARTMENT:
      return {
        ...state,
        openDepartment: action.openDepartment
      };

    case actionTypes.DEPARTMENT_LISTOBJ:
      return {
        ...state,
        departmentData: action.departmentData
      };

    case actionTypes.ISTOUPDATE_DEPT:
      return {
        ...state,
        isToUpdateDepartment: action.isToUpdateDepartment
    };

    case actionTypes.OPEN_SEARCHVIAKEYWORD:
      return {
        ...state,
        openSearchViaKeyword: action.openSearchViaKeyword
    };

    case actionTypes.OPEN_CREATENEWFOLDER:
      return {
        ...state,
        openCreateNewFolder: action.openCreateNewFolder
    };

    case actionTypes.FOLDER_LISTOBJ:
      return {
        ...state,
        folderData: action.folderData
    };


    case actionTypes.ISTOUPDATE_FOLDER:
      return {
        ...state,
        isToUpdateFolder: action.isToUpdateFolder
    };

    case actionTypes.OPEN_CREATENEWSUBFOLDER:
      return {
        ...state,
        openCreateSubNewFolder: action.openCreateSubNewFolder
    };

    case actionTypes.SUBFOLDER_LISTOBJ:
      return {
        ...state,
        SubfolderData: action.SubfolderData
    };

    case actionTypes.ISTOUPDATE_SUBFOLDER:
      return {
        ...state,
        isToUpdateSubFolder: action.isToUpdateSubFolder
    };

    case actionTypes.PASSID_LINK:
      return {
        ...state,
        passIdlink: action.passIdlink
    };


    case actionTypes.OPEN_ARCHIVEBYCAT:
      return {
        ...state,
        openArchiveByCat: action.openArchiveByCat
    };

    case actionTypes.OPEN_ARCHIVEBYDEPT:
      return {
        ...state,
        openArchiveByDept: action.openArchiveByDept
    };

    case actionTypes.OPEN_SUMMARYDOCTYPE:
      return {
        ...state,
        openSummaryDocType: action.openSummaryDocType
    };

    case actionTypes.OPEN_COATRANSMITTALREPORT:
      return {
        ...state,
        openCOATransmittalReport: action.openCOATransmittalReport
    };

    case actionTypes.OPEN_CREATEFILES:
      return {
        ...state,
        openCreateNewFile: action.openCreateNewFile
    };

    case actionTypes.FILES_DATAOBJ:
      return {
        ...state,
        filesDataObj: action.filesDataObj
    };

    case actionTypes.ISTOUPDATE_FILES:
      return {
        ...state,
        isToUpdateFiles: action.isToUpdateFiles
    };

    case actionTypes.PASS_SUBIDLINK:
      return {
        ...state,
        pass_SubIdLink: action.pass_SubIdLink
    };

    
    default:
      return state;
  }
};

export default customizationReducer;
