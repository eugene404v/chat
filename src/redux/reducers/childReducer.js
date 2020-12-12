import axios from "axios";
import moment from 'moment'

const initialState = {
    isLoaded: false,
  
    birthDate: '2005/11/11',
    addressReg: 'pushkin street',
    addressFact: 'kolotushkin house',
    document: 'passport #12@22',
    disability: true,
    invalid: false,
    alcoholism: true,
    smoking: false,
    drugs: true,
    other: false,
    asylum: true,
    asylumId: 2,

    childProf: [
      {
        id: 11,
        type: 'profilactica',
        status: 'forced',
        dateStart: '2001-11-04',
        dateEnd: '2002-09-09',
        reasonStart: 'start',
        reasonEnd: 'end'
      },
      {
        id: 765,
        type: 'Учет',
        status: 'Усиленный',
        dateStart: '2021-01-01',
        dateEnd: '2022-01-01',
        reasonStart: 'НАЧАЛОСЬ',
        reasonEnd: 'конец'
      }
    ],

    childCrimes: [
      {
        id: 2,
        date: '2001-01-01',
        type: {id: 1, name: 'UGOLOVNOE'},
        article: {id:1, name: 'voroval'},
        descr: 'совершил кражу'
      }
    ],

    childWork: [
      { 
        id: 15,
        type: 'work',
        place: 'webservis',
        dateStart: '2005-01-09',
        dateEnd: '2006-04-04'
      },
      { 
        id: 45,
        type: 'nice',
        place: 'rosstroyresurs',
        dateStart: '2025-01-09',
        dateEnd: '2056-04-04'
      }
    ],

    childEscape: [
      {
        id: 5,
        date: '2022-10-10',
        orderNum: "222",
        from: "школа",
        to: "пту", 
        reason: "ушел", 
        document: 'паспорт'
      },
    ],

    childIndividual: [
      {
        id:99,
        date: '2022-10-10',
        name: 'Профилактика',
        result: 'Никакой',
        period: '23 дня',
        specialist: 'Леха'
      }
    ]
};

const childReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CHILD": {
      if (action.data) {
        return {
        ...state,
        ...action.data,
        isLoaded: true
      };
      } else {
        return {
          ...state
        }
      }
      
    }
    case "REFRESH_CHILD": {
        return {
          ...state,
          isLoaded: false
        };
      }
    default:
      return state;
  }
};

export const fetchChild = (id) => (dispatch) => {
  axios
    .get(`/children/view/${id}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild(response.data.source));
    });
};

export const setChild = (data) => {
    return {
        type: 'SET_CHILD',
        data
    }
}

export const refreshChild = () => {
    return {
        type: 'REFRESH_CHILD'
    }
}

export const editChild = (data, id) => (dispatch) => {
    if(data.asylumBoolean == false) {
      data.asylum = 0
    }
    var formdata = new FormData();
    let key
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
      if (key === "asylumBoolean" && data[key]==false) {
        formdata.append('asylum', 0);
      }
    }
    axios.post(`/children/edit/${id}`,formdata, {
        headers: {
          Accept: "text/json",
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(function (response) {
        dispatch(setChild(response.data.source));
      });
}

export const fetchSelects = (institutionsId, districtsId, docTypesId, asylumsId) => (dispatch) => {
  axios
    .get(`/guides/list_items/${docTypesId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({  docTypesArr: response.data.data  }));
    });
  axios
    .get(`/guides/list_items/${districtsId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({  districtsArr: response.data.data  }));
    });
  axios
    .get(`/guides/list_items/${institutionsId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({  institutionsArr: response.data.data  }));
    });
  axios
    .get(`/guides/list_items/${asylumsId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({  asylumsArr: response.data.data  }));
    });
};

export const fetchProfSelects = ( typesId, statusId, reasonStartId, reasonEndId) => (dispatch) => {
  axios
    .get(`/guides/list_items/${typesId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({typesArr: response.data.data }));
    });
  axios
    .get(`/guides/list_items/${statusId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({ statusArr: response.data.data  }));
    });
    axios.get(`/guides/list_items/${reasonStartId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({  reasonStartArr: response.data.data }));
    });
    axios.get(`/guides/list_items/${reasonEndId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({ reasonEndArr: response.data.data  }));
    });
};

export const fetchProfIds = (fromId) => (dispatch) => {
  axios
  .get(`/guides/add_item/${fromId}`, {
    headers: {
      Accept: "text/json",
    },
  })
  .then(function (response) {
    dispatch(
      fetchProfSelects(
        response.data.fields.type.fromId,
        response.data.fields.status.fromId,
        response.data.fields.reasonStart.fromId,
        response.data.fields.reasonEnd.fromId,
     )
    );
  });
}

export const fetchCrimeSelects = ( typesId, articlesId) => (dispatch) => {
  axios
    .get(`/guides/list_items/${typesId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({crimeTypesArr: response.data.data }));
    });
  axios
    .get(`/guides/list_items/${articlesId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({ crimeArticlesArr: response.data.data  }));
    });
};

export const fetchCrimeIds = (fromId) => (dispatch) => {
  axios
  .get(`/guides/add_item/${fromId}`, {
    headers: {
      Accept: "text/json",
    },
  })
  .then(function (response) {
    dispatch(
      fetchCrimeSelects(
        response.data.fields.type.fromId,
        response.data.fields.article.fromId,
     )
    );
  });
}

export const fetchWorkSelects = ( typesId) => (dispatch) => {
  axios
    .get(`/guides/list_items/${typesId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({workTypesArr: response.data.data }));
    });
};

export const fetchWorkIds = (fromId) => (dispatch) => {
  axios
  .get(`/guides/add_item/${fromId}`, {
    headers: {
      Accept: "text/json",
    },
  })
  .then(function (response) {
    dispatch(
      fetchWorkSelects(
        response.data.fields.type.fromId,
     )
    );
  });
}

export const fetchIndividualsSelects = ( specsId) => (dispatch) => {
  axios
    .get(`/guides/list_items/${specsId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      let tempArr = response.data.data
      tempArr = tempArr.map(el =>  {return{...el, name: el.fio}})
      dispatch(setChild({specialistsArr: tempArr }));
    });
};

export const fetchIndividualsIds = (fromId) => (dispatch) => {
  axios
  .get(`/guides/add_item/${fromId}`, {
    headers: {
      Accept: "text/json",
    },
  })
  .then(function (response) {
    dispatch(
      fetchIndividualsSelects(
        response.data.fields.specialist.fromId,
     )
    );
  });
}

export const fetchEscapeSelects = (toDistrId, toInstId, reasonId) => (dispatch) => {
  axios
    .get(`/guides/list_items/${toDistrId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({toDistrArr: response.data.data }));
    });
  axios
    .get(`/guides/list_items/${toInstId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({toInstArr: response.data.data }));
    });
  axios
    .get(`/guides/list_items/${reasonId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({escapeReasonsArr: response.data.data }));
    });
};

export const fetchEscapeIds = (fromId) => (dispatch) => {
  axios
  .get(`/guides/add_item/${fromId}`, {
    headers: {
      Accept: "text/json",
    },
  })
  .then(function (response) {
    dispatch(
      fetchEscapeSelects(
        response.data.fields.toDistr.fromId,
        response.data.fields.toInst.fromId,
        response.data.fields.reason.fromId,
     )
    );
  });
}

export const addChild = (data) => (dispatch) => {
  const formData = {}
  var formdata = new FormData();
  let key
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
  axios.post(`/children/add`,formdata, {
      headers: {
        Accept: "text/json",
        'Content-Type': 'multipart/form-data'
      },
    })
    .then(function (response) {
      //dispatch(setChild(response.data.source));
    });
}

export default childReducer;
