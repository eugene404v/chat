import axios from "axios";
import moment from 'moment'

const initialState = {
    isLoaded: false,
  
    birthDate: '2005/11/11',
    addressReg: ' ',
    addressFact: ' ',
    document: ' ',
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
        type: '',
        status: '',
        dateStart: '2001-11-04',
        dateEnd: '2002-09-09',
        reasonStart: '',
        reasonEnd: ''
      },
      {
        id: 765,
        type: '',
        status: '',
        dateStart: '2021-01-01',
        dateEnd: '2022-01-01',
        reasonStart: '',
        reasonEnd: ''
      }
    ],

    childCrimes: [
      {
        id: 2,
        date: '2001-01-01',
        type: {id: 1, name: ''},
        article: {id:1, name: ''},
        descr: ' '
      }
    ],

    childWork: [
      { 
        id: 15,
        type: '',
        place: '',
        dateStart: '2005-01-09',
        dateEnd: '2006-04-04'
      },
      { 
        id: 45,
        type: '',
        place: '',
        dateStart: '2025-01-09',
        dateEnd: '2056-04-04'
      }
    ],

    childEscape: [
      {
        id: 5,
        date: '2022-10-10',
        orderNum: "222",
        from: "",
        to: "", 
        reason: "", 
        document: ''
      },
    ],

    childIndividual: [
      {
        id:99,
        date: '2022-10-10',
        name: '',
        result: '',
        period: '23 ',
        specialist: ''
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
      case "SET_PROF_SELECT_LAST": {
        return {
          ...state,
          reasonArr: action.reasonArr
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
      if (response.data._user) {
        dispatch(setChild(response.data.source));
      } else {
        window.location.replace('/login')
      }
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

export const editChild = (data, id, inst) => (dispatch) => {
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
    data["asylumBoolean"] && formdata.append('asylum', inst)
    axios.post(`/children/edit/${id}`,formdata, {
        headers: {
          Accept: "text/json",
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(function (response) {
        dispatch(refreshChild());
        dispatch(fetchChild(id));
      });
}

export const fetchSelects = (districtsId, docTypesId, asylumsId) => (dispatch) => {
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
    .get(`/guides/list_items/18/0/0/0/0/1`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({  districtsArr: response.data.data  }));
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

export const fetchProfSelects = ( typesId, status) => (dispatch) => {
  axios
    .get(`/guides/list_items/${typesId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({typesArr: response.data.data }));
    })
    .then(function () {
      dispatch(setChild({ statusArr: [{name:'Поставлен', id: 'Поставлен'}, {name:'Снят', id: 'Снят'}]  }));
    });
    
};

export const setProfSelectLast = (arr) => {
  return {
    type: 'SET_PROF_SELECT_LAST',
    reasonArr: arr
  }

}

export const fetchInstSelects = (val) => (dispatch) => {
  axios
    .get(`/institutions/search_by=name&search=${val}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({typesArr: response.data.data }));
    })
    .then(function () {
      dispatch(setChild({ institutionsArr: [{name:'Поставлен', id: 'Поставлен'}, {name:'Снят', id: 'Снят'}]  }));
    });
} 

export const fetchProfSelectLast = (start, typeId) => (dispatch) => {
    let status
    if (start==='Поставлен') {
      status=0
    } else {
     status=1
    }
  axios.get(`/children/loadSelect/prof?forEnd=${status}&profType=${typeId}`, {
    headers: {
      Accept: "text/json",
    },
  })
  .then(function (response) {
    dispatch(setProfSelectLast( response.data.data ));
  });
}

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
        //response.data.fields.reasonStart.fromId,
        //response.data.fields.reasonEnd.fromId,
     )
    );
  });
}

export const fetchCrimeSelects = ( crimeType) => (dispatch) => {
  axios
    .get(`/children/loadSelect/article?crimeType=${crimeType}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChild({ crimeArticlesArr: response.data.data  }));
      dispatch(setChild({ crimeTypesArr: [{name: 'Административное', id: 'Административное'}, {name: 'Уголовное', id: 'Уголовное'}, {name: 'Проступок', id: 'Проступок'}]  }));
    });
};

export const fetchCrimeIds = (fromId, type) => (dispatch) => {
  axios
  .get(`/guides/add_item/${fromId}`, {
    headers: {
      Accept: "text/json",
    },
  })
  .then(function (response) {
    dispatch(
      fetchCrimeSelects(
        type,
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
    .get(`/users/search?search=`, {
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
    .get(`/guides/list_items/${toDistrId}/0/0/0/0/1`, {
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
    if (key === "asylumBoolean" && data[key]==false) {
      formdata.append('asylum', 0);
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
