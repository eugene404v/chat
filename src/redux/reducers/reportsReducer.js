import axios from "axios";

const initialState = {
  isLoaded: false,
  reportPage: 1,
};

const reportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_COMMON_REPORT": {
      return {
        ...state,
        children: action.children,
        reportPage: action.page,
        total: action.total,
        file: action.file
      };
    }
    case "CLEAR_COMMON_REPORT": {
      return {
        ...state,
        children: null,
      };
    }
    case "SET_COMMON_SELECTS": {
      return {
        ...state,
        childProfTypesArr: action.childProfTypesArr,
        districtsArr: action.districts
      };
    }
    case "SET_COMMON_INSTS_SELECTS": {
      return {
        ...state,
        childInstArr: action.childInstArr,
      };
    }
    case "CLEAR_FILTERS": {
      return {
        ...state,
        filters: "",
      };
    }
    case "SET_PROF": {
      return {
        ...state,
        prof: action.prof,
      };
    }
    case "SET_INST": {
      return {
        ...state,
        inst: action.inst,
      };
    }
    case "SET_DISTR": {
      return {
        ...state,
        distr: action.distr,
      };
    }
    case "CLEAR_COMMON_DISTR": {
      return {
        ...state,
        childInstArr: null
      };
    }
    case "SET_ARCHIVE": {
      return {
        ...state,
        archived: action.archived,
      };
    }
    default:
      return state;
  }
};

export const setCommonReport = (array, page, total, file) => {
  return {
    type: "SET_COMMON_REPORT",
    children: array,
    page,
    total, file
  };
};

export const clearCommonReport = () => {
  return {
    type: "CLEAR_COMMON_REPORT",
  };
};

export const fetchCommonReport = (prof, inst, distr, archived = 0, page) => (dispatch) => {
  var formdata = new FormData();
  prof && formdata.append('childProfType', prof);
  inst && formdata.append('institution', inst);
  archived && formdata.append('archived', archived);
  distr && formdata.append('district', distr);
  axios
    .post(`/children/commonReport?page=${page}&limit=30`, formdata, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      if (response.data._user) {
        dispatch(clearCommonReport());
        dispatch(setCommonReport(response.data.data, page, response.data.total, response.data.file));
      } else {
        //window.location.replace('/login')
      }
    });
};

const setCommonSelects = (data) => {
  return {
    type: "SET_COMMON_SELECTS",
    childProfTypesArr: data.childProfType && data.childProfType.data,
    childInstArr: data.institution && data.institution.data,
    districts: data.districts && data.districts.data
  };
};

const setInstSelects = (data) => {
  return {
    type: "SET_COMMON_INSTS_SELECTS",
    childInstArr: data,
  };
};

export const fetchCommonSelects = () => (dispatch) => {
  axios
    .get(`/children/commonReport/filters`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setCommonSelects(response.data));
    });
};

export const fetchInstsByDistr = (distrId) => (dispatch) => {
  axios
  .get(`/institution/search?search_by=district&search=${distrId}`, {
    headers: {
      Accept: "text/json",
    },
  })
  .then(function (response) {
    dispatch(clearDistr())
    dispatch(setInstSelects(response.data.data));
  });
}

export const clearFilters = () => {
  return {
    type: "CLEAR_FILTERS",
  };
};

export const setProf = (prof) => {
  return {
    type: "SET_PROF",
    prof,
  };
};

export const setInst = (inst) => {
  return {
    type: "SET_INST",
    inst,
  };
};

export const setDistr = (distr) => {
  return {
    type: "SET_DISTR",
    distr,
  };
};

export const clearDistr = () => {
  return {
    type: 'CLEAR_COMMON_DISTR'
  }
}

export const setArchive = (archived) => {
  return {
    type: "SET_ARCHIVE",
    archived,
  };
};

export const downloadReport = (prof, inst, archived) => (dispatch) =>  {
  var formdata = new FormData();
  prof && formdata.append('childProfType', prof);
  inst && formdata.append('institution', inst);
  archived && formdata.append('archived', archived);
  axios
    .post(`/children/commonReport/excel`, formdata, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {

    });
}

export default reportsReducer;
