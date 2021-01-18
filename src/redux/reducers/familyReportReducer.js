import axios from "axios";
import moment from "moment";

const initialState = {
  isLoaded: false,
  reportPage: 1,
  filters: {},
};

const familyReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FAMILY_REPORT": {
      return {
        ...state,
        children: action.children,
        file: action.file,
        reportPage: action.page,
        total: action.total
      };
    }
    case "CLEAR_FAMILY_REPORT": {
      return {
        ...state,
        children: null,
      };
    }
    case "SET_FAMILY_SELECTS": {
      return {
        ...state,
        familyFeaturesArr: action.familyFeaturesArr,
        familyTypesArr: action.familyTypesArr, 
      };
    }
    case "CLEAR_FAMILY_FILTERS": {
      return {
        ...state,
        filters: "",
      };
    }
    case "SET_FAMILY_FILTERS": {
      return {
        ...state,
        filters: action.filters,
      };
    }
    default:
      return state;
  }
};

export const setFamilyReport = (data, page, total) => {
  return {
    type: "SET_FAMILY_REPORT",
    children: data,
    file: data && data.file,
    page,
    total
  };
};

export const clearFamilyReport = () => {
  return {
    type: "CLEAR_FAMILY_REPORT",
  };
};

export const fetchFamilyReport = (data, page=1, ignore) => (dispatch) => {
    dispatch(setFamilyFilters(data))
  var formdata = new FormData();
  let key;
  for (key in data) {
    if (data[key] !== undefined && data[key] !== true && data[key] !== false && data[key] !== null) {
      if (
        key !== "familyMpr_date" &&
        key !== "familyMpr_dateEnd" &&
        key !== "familySop_date" &&
        key !== "familySop_dateEnd"
      ) {
        formdata.append(key, data[key]);
      } else if (
        key === "familyMpr_date" ||
        key === "familyMpr_dateEnd" ||
        key === "familySop_date" ||
        key === "familySop_dateEnd"
      ) {
        formdata.append(key, moment(data[key]).format("YYYY-MM-DD").toString());
      } 
    } else if (data[key] === true) {
      formdata.append(key, 1);
    } else if (data[key] === false) {
      formdata.append(key, 0);
    }
  }
  axios
    .post(`/family/detailedReport${ignore?'/0/1':''}?page=${page}&limit=30`, formdata, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      if (response.data._user) {
        dispatch(clearFamilyReport());
        dispatch(setFamilyReport(response.data.data, page, response.data.total));
      } else {
        window.location.replace('/login')
      }
    });
};

const setFamilySelects = (data) => {
  return {
    type: "SET_FAMILY_SELECTS",
    familyFeaturesArr: data.familyFeatures &&  data.familyFeatures.data,
    familyTypesArr: data.familyType && data.familyType.data,
  };
};

export const fetchFamilySelects = () => (dispatch) => {
  axios
    .get(`/family/detailedReport/filters`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setFamilySelects(response.data));
    });
};

export const setFamilyFilters = (data) => {
  return {
    type: "SET_FAMILY_FILTERS",
    filters: data
  };
};


export const downloadFamilyReport = (data) => {
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
      .post(`/family/detailedReport/excel`, formdata, {
        headers: {
          Accept: "text/json",
        },
      })
      .then(function (response) {

      });
}

export const searchParentsReport = (search) => (dispatch) => {
  axios
    .get(`/family/search/1?search_by=name&search=${search}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      if (response.data._user) {
        dispatch(clearFamilyReport());   
        dispatch(setFamilyReport(response.data.data));
      } else {
        alert(response.data.info)
      }
    });
}


export default familyReportReducer;
