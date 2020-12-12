import axios from "axios";

const initialState = {
  isLoaded: false,
  alcoholism: true,
  drugs: true,
  manyChildren: false,

  familyType: { id: 1, name: "Полная" },
  familyTypesArr: [
    { id: 1, name: "Полная" },
    { id: 2, name: "Неполная" },
    { id: 3, name: "Опекунская" },
    { id: 4, name: "Приемная" },
    {
      id: 5,
      name:
        "Проживает в учреждении для детей-сирот и детей, оставшихся без попечения родителей",
    },
  ],
  familyFeatures: { id: 1, name: "Благополучная" },
  familyFeaturesArr: [
    { id: 1, name: "Благополучная" },
    { id: 2, name: "ТЖС" },
    { id: 3, name: "СОП: педагогически некомпетентная" },
    { id: 4, name: "СОП: конфликтная" },
    { id: 5, name: "СОП: асоциальная" },
  ],

  familyMates: [
    {
      id: 65,
      name: "Антоха",
      ties: "1",
      date: "2001-11-04",
      work: "нет",
    },
  ],

  familySop: [
    {
      id: 2,
      status: "forced",
      dateStart: "2001-11-04",
      dateEnd: "2002-09-09",
      reasonStart: "start",
      reasonEnd: "end",
    },
    {
      id: 33,
      status: "Усиленный",
      dateStart: "2021-01-01",
      dateEnd: "2022-01-01",
      reasonStart: "НАЧАЛОСЬ",
      reasonEnd: "конец",
    },
  ],

  familyMpr: [
    {
      id: 27,
      status: "В процессе",
      dateStart: "2071-01-05",
      dateEnd: "2062-02-02",
      reasonStart: "початок",
      reasonEnd: "кiнець",
    },
  ],

  familyIndividual: [
    {
      id: 99,
      date: "2022-10-10",
      name: "Профилактика",
      result: "Никакой",
      period: "23 дня",
      specialist: "Леха",
      report: "Тут наши полномочия все",
    },
  ],
};

const familyReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FAMILY": {
      const tempParents = action.data && Array.isArray(action.data.parents ) && action.data.parents && action.data.parents.map((el) => {
        return { ...el, type: "parent" };
      });
      const tempChildren = action.data && Array.isArray(action.data.children) && action.data.children && action.data.children.map((el) => {
        return { ...el, type: "child" }; 
      });
      const tempMates = Array.isArray(tempChildren) && Array.isArray(tempParents) && [...tempChildren, ...tempParents];
      return {
        ...state,
        ...action.data,
        familyMates: tempMates,
        isLoaded: true,
      };
    }
    case "REFRESH_FAMILY": {
      return {
        ...state,
        isLoaded: false,
      };
    }
    case "SET_FAMILY_TYPE": {
      return {
        ...state,
        familyType: action.familyType,
      };
    }
    case "SET_FAMILY_MATE": {
      return {
        ...state,
        familyMate: action.familyMate
      }
    }
    default:
      return state;
  }
};

export const fetchFamily = (id) => (dispatch) => {
  axios
    .get(`/family/view/${id}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setFamily(response.data.source));
    });
};

export const setFamily = (data) => {
  return {
    type: "SET_FAMILY",
    data,
  };
};

export const refreshFamily = () => {
  return {
    type: "REFRESH_FAMILY",
  };
};

export const editFamily = (data, id) => (dispatch) => {
  const formData = {};
  var formdata = new FormData();
  let key;
  for (key in data) {
    if (data[key] === true) {
      formdata.append(key, 1);
    } else if (data[key] === false) {
      formdata.append(key, 0);
    } else {
      formdata.append(key, data[key]);
    }
  }
  axios
    .post(`/family/edit/${id}`, formdata, {
      headers: {
        Accept: "text/json",
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      dispatch(setFamily(response.data.source));
    });
};

export const fetchFamilySopSelects = (statusId, reasonStartId, reasonEndId) => (
  dispatch
) => {
  axios
    .get(`/guides/list_items/${statusId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setFamily({ familySopStatusArr: response.data.data }));
    });
  axios
    .get(`/guides/list_items/${reasonStartId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setFamily({ familySopReasonStartArr: response.data.data }));
    });
  axios
    .get(`/guides/list_items/${reasonEndId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setFamily({ familySopReasonEndArr: response.data.data }));
    });
};

export const fetchFamilySopIds = (fromId) => (dispatch) => {
  axios
    .get(`/guides/add_item/${fromId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(
        fetchFamilySopSelects(
          response.data.fields.status.fromId,
          response.data.fields.reasonStart.fromId,
          response.data.fields.reasonEnd.fromId
        )
      );
    });
};

export const fetchFamilyMprSelects = (statusId, reasonStartId, reasonEndId) => (
  dispatch
) => {
  axios
    .get(`/guides/list_items/${statusId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setFamily({ familyMprStatusArr: response.data.data }));
    });
  axios
    .get(`/guides/list_items/${reasonStartId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setFamily({ familyMprReasonStartArr: response.data.data }));
    });
  axios
    .get(`/guides/list_items/${reasonEndId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setFamily({ familyMprReasonEndArr: response.data.data }));
    });
};

export const fetchFamilyMprIds = (fromId) => (dispatch) => {
  axios
    .get(`/guides/add_item/${fromId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(
        fetchFamilyMprSelects(
          response.data.fields.status.fromId,
          response.data.fields.reasonStart.fromId,
          response.data.fields.reasonEnd.fromId
        )
      );
    });
};

export const fetchFamilyIndividualSelects = (id) => (dispatch) => {
  axios
    .get(`/guides/list_items/${id}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      let tempArr = response.data.data;
      tempArr = tempArr.map((el) => {
        return { ...el, name: el.fio };
      });
      dispatch(setFamily({ familySpecsArr: tempArr }));
    });
};

export const fetchFamilyIndividualIds = (fromId) => (dispatch) => {
  axios
    .get(`/guides/add_item/${fromId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(
        fetchFamilyIndividualSelects(
          response.data.fields.specialist.fromId //??????????????????????????????????????????????
        )
      );
    });
};

export const addFamily = (data) => (dispatch) => {
  const formData = {};
  var formdata = new FormData();
  let key;
  for (key in data) {
    if (data[key] === true) {
      formdata.append(key, 1);
    } else if (data[key] === false) {
      formdata.append(key, 0);
    } else {
      formdata.append(key, data[key]);
    }
  }
  axios
    .post(`/family/add`, formdata, {
      headers: {
        Accept: "text/json",
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {});
};

export const fetchFamilyMate = (link) => (dispatch) => {
  alert('fetchMate')
  axios
    .get(link, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(
        setFamilyMate(response.data)
      );
    });
};

export const setFamilyMate = (data) => {
  return {
    type: 'SET_FAMILY_MATE',
    familyMate: data
  }
}

export default familyReducer;
