import axios from "axios";
import moment from "moment";

const initialState = {
  isLoaded: false,
  reportPage: 1,
  filters: {},
};

const childrenReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_COMMON_REPORT": {
      return {
        ...state,
        children: action.children,
        reportPage: action.page,
        file: action.file,
        reportPage: action.page,
        total: action.total
      };
    }
    case "CLEAR_COMMON_REPORT": {
      return {
        ...state,
        children: null,
      };
    }
    case "SET_CHILDREN_SELECTS": {
      return {
        ...state,
        articlesArr: action.articlesArr,
        childProfTypesArr: action.childProfTypesArr,
        childWorkTypesArr: action.childWorkTypesArr,
        childInstArr: action.childInstArr,
        child_prof_reasonStartArr: action.child_prof_reasonStartArr,
        child_prof_reasonEndArr: action.child_prof_reasonEndArr,
      };
    }
    case "CLEAR_CHILDREN_FILTERS": {
      return {
        ...state,
        filters: "",
      };
    }
    case "SET_CHILDREN_FILTERS": {
      return {
        ...state,
        filters: action.filters,
      };
    }
    case "SET_INST": {
      return {
        ...state,
        inst: action.inst,
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

export const setCommonReport = (data, page) => {
  return {
    type: "SET_COMMON_REPORT",
    children: data.data,
    file: data.file,
    page,
    total: data.total
  };
};

export const clearCommonReport = () => {
  return {
    type: "CLEAR_COMMON_REPORT",
  };
};

export const fetchChildrenReport = (data, page=1,ignore, inst) => (dispatch) => {
    dispatch(setFilters(data, inst))
  var formdata = new FormData();
  let key;
  for (key in data) {
    if (data[key] !== undefined && data[key] !== true && data[key] !== false && data[key] !== null) {
      if (
        key !== "birthDate" &&
        key !== "child_prof_dateStart" &&
        key !== "child_prof_dateEnd"
      ) {
        formdata.append(key, data[key]);
      } else if (
        key === "birthDate" ||
        key === "child_prof_dateStart" ||
        key === "child_prof_dateEnd"
      ) {
        formdata.append(key, moment(data[key]).format("YYYY-MM-DD").toString());
      }
    } else if (data[key] === true) {
      formdata.append(key, 1);
    } else if (data[key] === false) {
      formdata.append(key, 0);
    }
  }
  inst && formdata.append('institution', inst)
  axios
    .post(`/children/detailedReport${ignore?'/0/1':''}?page=${page}&limit=30`, formdata, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      if (response.data._user) {
        dispatch(clearCommonReport());   
        dispatch(setCommonReport(response.data, page));
      } else {
        window.location.replace('/login')
      }
    });
};

const setChildrenSelects = (data) => {
  return {
    type: "SET_CHILDREN_SELECTS",
    articlesArr: data.article.data,
    childProfTypesArr: data.childProfType.data,
    childWorkTypesArr: data.childWorkType && data.childWorkType.data,
    childInstArr: data.institution && data.institution.data,
    child_prof_reasonStartArr: data.child_prof_reason.data,
    //child_prof_reasonEndArr: data.child_prof_reasonEnd.data,
  };
};

export const fetchChildrenSelects = () => (dispatch) => {
  axios
    .get(`/children/detailedReport/filters`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChildrenSelects(response.data));
    });
};

export const setFilters = (data, inst) => {
  return {
    type: "SET_CHILDREN_FILTERS",
    filters: {...data, institution: inst}
  };
};


export const downloadReport = (data) => {
    var formdata = new FormData();
    let key;
    for (key in data) {
      if (data[key] !== undefined && data[key] !== 'no') {
        if (
          key !== "birthDate" &&
          key !== "child_prof_dateStart" &&
          key !== "child_prof_dateEnd"
        ) {
          formdata.append(key, data[key]);
        } else if (
          key === "birthDate" ||
          key === "child_prof_dateStart" ||
          key === "child_prof_dateEnd"
        ) {
          formdata.append(key, moment(data[key]).format("YYYY-MM-DD").toString());
        }
      } 
    }
    axios
      .post(`/children/detailedReport/excel`, formdata, {
        headers: {
          Accept: "text/json",
        },
      })
      .then(function (response) {

      });
}

export const searchChildrenReport = (search) => (dispatch) => {
  axios
    .get(`/children/search/1?search_by=name&search=${search}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      if (response.data._user) {
        dispatch(clearCommonReport());   
        dispatch(setCommonReport(response.data));
      } else {
        alert(response.data.info)
      }
    });
}


export default childrenReportReducer;
