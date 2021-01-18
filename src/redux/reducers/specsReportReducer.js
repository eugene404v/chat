import axios from "axios";
import moment from "moment";

const initialState = {
  isLoaded: false,
  reportPage: 1,
  filters: {},
};

const specsReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SPECS_REPORT": {
      return {
        ...state,
        children: action.children,
        reportPage: action.page,
        total: action.total,
        file: action.file
      };
    }
    case "CLEAR_SPECS_REPORT": {
      return {
        ...state,
        children: null,
      };
    }
    case "SET_SPECS_SELECTS": {
      return {
        ...state,
        crimeTypesArr: action.crimeTypesArr
      };
    }
    case "CLEAR_SPECS_FILTERS": {
      return {
        ...state,
        filters: "",
      };
    }
    case "SET_SPECS_FILTERS": {
      return {
        ...state,
        filters: action.filters,
      };
    }
    default:
      return state;
  }
};

export const setFamilyReport = (array, page, total, file) => {
  return {
    type: "SET_SPECS_REPORT",
    children: array,
    page,
    total, file
  };
};

export const clearFamilyReport = () => {
  return {
    type: "CLEAR_SPECS_REPORT",
  };
};

export const fetchFamilyReport = (data, page) => (dispatch) => {
    dispatch(setFamilyFilters(data))
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
    .post(`/users/detailedReport?page=${page}&limit=30`, formdata, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      if (response.data._user) {
        dispatch(clearFamilyReport());
        dispatch(setFamilyReport(response.data.data, page, response.data.total, response.data.file));
      } else {
        window.location.replace('/login')
      }
    });
};

const setFamilySelects = (data) => {
  return {
    type: "SET_SPECS_SELECTS",
    crimeTypesArr: data.crimeType.data,
  };
};

export const fetchFamilySelects = () => (dispatch) => {
  axios
    .get(`/parents/detailedReport/filters`, {
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
    type: "SET_SPECS_FILTERS",
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
    .get(`/users/search/1?search_by=name&search=${search}`, {
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



export default specsReportReducer;
