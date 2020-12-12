import axios from "axios";
import moment from "moment";

const initialState = {
  isLoaded: false,

  birthDate: "2005/11/11",
  addressReg: "pushkin street",
  addressFact: "kolotushkin house",
  documentType: 1,
  documentIssuedBy: "dfkhbjsadkhb",
  documentNumber: 24,
  documentIssuedDate: "2005/11/11",
  work: "devOps",
  district: { name: "", id: "" },
  alcoholism: true,
  drugs: true,
  lowerRights: false,
  deprivedRights: true,
  solitude: true,
  prison: false,
  crimes: [
    {
      id: 1,
      initiator: { id: 1, name: "ГУВД Области" },
      date: "2012-04-11",
      type: { id: 1, name: "Крупное хулиганство" },
      descr: "Ст 24 УК РФ - Крупное хулиганство",
    },
    {
      id: 2,
      initiator: { id: 2, name: "ГУВД Города" },
      date: "2022-07-01",
      type: { id: 2, name: "Мелкое хулиганство" },
      descr: "Ст 22 УК РФ - Мелкое хулиганство",
    },
  ],
  guideId: 13,
  docsId: 0,
};

const parentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PARENT": {
      let canDelRows = false;
      if (action.data && action.data._user) {
        const user = action.data._user.type;
        if (user === "admin" || user === "region") {
          canDelRows = true;
        }
        return {
          ...state,
          ...action.data.source,
          user: user,
          isLoaded: true,
          canDelRows,
        };
      } else if (action.data) {
        if (state.user === "admin" || state.user === "region") {
          canDelRows = true;
        }
        return {
          ...state,
          ...action.data.source,
          isLoaded: true,
          canDelRows
        };
      } else {
        return {
          ...state
        }
      }
    }
    case "REFRESH_PARENT": {
      return {
        ...state,
        isLoaded: false,
      };
    }
    default:
      return state;
  }
};

export const fetchParent = (id) => (dispatch) => {
  axios
    .get(`/parents/view/${id}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setParent(response.data));
    });
};

export const setParent = (data) => {
  return {
    type: "SET_PARENT",
    data,
  };
};

export const refreshParent = () => {
  return {
    type: "REFRESH_PARENT",
  };
};

export const editParent = (data, id) => (dispatch) => {
  const formData = {};
  var formdata = new FormData();
  let key;
  for (key in data) {
    if (key != "birthDate" && key != "documentIssuedDate") {
      formdata.append(key, data[key]);
    } else if (key == "birthDate" || key == "documentIssuedDate") {
      formdata.append(key, moment(data[key]).format("YYYY-MM-DD").toString());
    } 
    if (data[key]===true) {
      formdata.append(key, 1);
    } else if (data[key]===false) {
      formdata.append(key, 0);
    }
  }
  axios
    .post(`/parents/edit/${id}`, formdata, {
      headers: {
        Accept: "text/json",
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      dispatch(setParent(response.data.source));
    });
};

export const fetchSelects = (docsId, districtsId) => (dispatch) => {
  axios
    .get(`/guides/list_items/${docsId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setParent({ source: { docsArr: response.data.data } }));
    });
  axios
    .get(`/guides/list_items/${districtsId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setParent({ source: { districtsArr: response.data.data } }));
    });
};

export const fetchCrimesSelects = (initId, typesId) => (dispatch) => {
  axios
    .get(`/guides/list_items/${initId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setParent({ source: { initiatorsArr: response.data.data } }));
    });
  axios
    .get(`/guides/list_items/${typesId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setParent({ source: { crimeTypesArr: response.data.data } }));
    });
};

export const fetchCrimeIds = (guide) => (dispatch) => {
  axios
    .get(`/guides/add_item/${guide}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(
        fetchCrimesSelects(
          response.data.fields.initiator.fromId,
          response.data.fields.type.fromId
        )
      );
    });
};

export const addParent = (data) => (dispatch) => {
  var formdata = new FormData();
  let key;
  for (key in data) {
    if (key != "birthDate" && key != "documentIssuedDate") {
      formdata.append(key, data[key]);
    } else if (key == "birthDate" || key == "documentIssuedDate") {
      formdata.append(key, moment(data[key]).format("YYYY-MM-DD").toString());
    } 
    if (data[key]===true) {
      formdata.append(key, 1);
    } else if (data[key]===false) {
      formdata.append(key, 0);
    }
  }
  axios
    .post(`/parents/add`, formdata, {
      headers: {
        Accept: "text/json",
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
//
    });
};

export default parentReducer;
