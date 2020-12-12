import axios from "axios";

const initialState = {
    isLoaded: false,
    name: 'Ivan Testov',
    tel: '+25259876',
    mail: 'ivan@ivan.ru',
    institution: {id:1, name: 'www'},
    district: {id:1, name:'leninskiy'},
    job: {id: 1, text: 'nice'},
    jobChar: {id: 1, text: 'nice'},
    jobType: {id: 1, text: 'nice'},
    jobExperience: 1,
};

const specialistReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SPECIALIST": {
      return {
        ...state,
        ...action.data.source,
        isLoaded: true
      };
    }
    case "REFRESH_SPECIALIST": {
        return {
          ...state,
          isLoaded: false
        };
      }
    default:
      return state;
  }
};

export const fetchSpecialist = (id) => (dispatch) => {
  axios
    .get(`/users/view/${id}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setSpecialist(response.data));
    });
};

export const setSpecialist = (data) => {
    return {
        type: 'SET_SPECIALIST',
        data
    }
}

export const refreshSpecialist = () => {
    return {
        type: 'REFRESH_SPECIALIST'
    }
}

export const editSpecialist = (data, id) => (dispatch) => {
    const formData = {}
    var formdata = new FormData();
    let key
    for (key in data){
        formdata.append(key, data[key])
    }
    axios.post(`/users/edit/${id}`,formdata, {
        headers: {
          Accept: "text/json",
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(function (response) {
        dispatch(setSpecialist(response.data.source));
      });
}

export const fetchSelects = (instId, districtsId, jobsId, jobsCharsId, jobsTypesId) => (dispatch)=> {
  axios
    .get(`/guides/list_items/${instId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setSpecialist({source: {institutionsArr: response.data.data}}));
    });
    axios
    .get(`/guides/list_items/${districtsId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setSpecialist({source: {districtsArr: response.data.data}}));
    });
    axios
    .get(`/guides/list_items/${jobsId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setSpecialist({source: {allJobs: response.data.data}}));
    });
    axios
    .get(`/guides/list_items/${jobsCharsId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setSpecialist({source: {allJobChars: response.data.data}}));
    });
    axios
    .get(`/guides/list_items/${jobsTypesId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setSpecialist({source: {allJobTypes: response.data.data}}));
    });
}

export const addSpecialist = (data) => {
  var formdata = new FormData();
  let key
  for (key in data){
      formdata.append(key, data[key])
  }
  axios.post(`/users/add/`,formdata, {
      headers: {
        Accept: "text/json",
        'Content-Type': 'multipart/form-data'
      },
    })
    .then(function (response) {
      
    });
}

export default specialistReducer;
