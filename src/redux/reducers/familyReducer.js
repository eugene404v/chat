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
      name: "",
      ties: "1",
      date: "2001-11-04",
      work: "",
    },
  ],

  familySop: [
    {
      id: 2,
      status: "",
      dateStart: "2001-11-04",
      dateEnd: "2002-09-09",
      reasonStart: "",
      reasonEnd: "",
    },
    {
      id: 33,
      status: "",
      dateStart: "2021-01-01",
      dateEnd: "2022-01-01",
      reasonStart: "",
      reasonEnd: "",
    },
  ],

  familyMpr: [
    {
      id: 27,
      status: " ",
      dateStart: "2071-01-05",
      dateEnd: "2062-02-02",
      reasonStart: "",
      reasonEnd: "",
    },
  ],

  familyIndividual: [
    {
      id: 99,
      date: "2022-10-10",
      name: "",
      result: "",
      period: "23 ",
      specialist: "",
      report: "  ",
    },
  ],
};

const familyReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FAMILY": {
      const tempParents = action.data && Array.isArray(action.data.connected_members ) && action.data.connected_members && action.data.connected_members.map((el) => {
        return { 
          ...el, 
          fio: el.parent_member.name || el.child_member.name,
          childId: el.child_member.id || 0,
          parentId: el.parent_member.id || 0,
          birthDate:  el.parent_member.birthDate || el.child_member.birthDate,
          work:  el.parent_member.work || (el.child_member.institution && el.child_member.institution.name),
        };
      });
      const tempChildren = action.data && Array.isArray(action.data.children) && action.data.children && action.data.children.map((el) => {
        return { ...el, type: "child" }; 
      });
      const tempMates = Array.isArray(tempParents) && [...tempParents];
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
      if (response.data._user) {
        dispatch(setFamily(response.data.source));
      } else {
        window.location.replace('/login')
      }
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

export const fetchFamilySopSelects = (status) => (
  dispatch
) => {
  axios
    .get(`/family/loadSelect/sop?forEnd=${status}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setFamily({ familySopReasonArr: response.data.data }));
      dispatch(setFamily({ familySopStatusArr: [{name:'Поставлен', id: 'Поставлен'}, {name:'Снят', id: 'Снят'}] }));
    });
};

export const fetchFamilySopIds = (fromId, status) => (dispatch) => {
  axios
    .get(`/guides/add_item/${fromId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(
        fetchFamilySopSelects(
            status
        )
      );
    });
};

export const fetchFamilyMprSelects = (status) => (
  dispatch
) => {
  axios
    .get(`/family/loadSelect/mpr?forEnd=${status}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setFamily({ familyMprStatusArr: [{name:'Утверждена', id: 'Утверждена'}, {name:'Прекращена', id: 'Прекращена'}] }));
      dispatch(setFamily({ familyMprReasonArr: response.data.data }));
    });
};

export const fetchFamilyMprIds = (fromId, status) => (dispatch) => {
  axios
    .get(`/guides/add_item/${fromId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(
        fetchFamilyMprSelects(
          status
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
      tempArr = tempArr && tempArr.map((el) => {
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
          //response.data.fields.specialist.fromId //??????????????????????????????????????????????
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
