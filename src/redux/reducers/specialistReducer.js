import axios from "axios";

const initialState = {
    isLoaded: false,
    name: '',
    tel: '',
    mail: '',
    institution: {id:1, name: ''},
    district: {id:1, name:''},
    job: {id: 1, text: ''},
    jobChar: {id: 1, text: ''},
    jobType: {id: 1, text: ''},
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
      if (response.data._user) {
        dispatch(setSpecialist(response.data));
      } else {
        window.location.replace('/login')
      }
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

export const editSpecialist = (data, id, inst) => (dispatch) => {
    const formData = {}
    var formdata = new FormData();
    let key
    for (key in data){
      if (key !== 'job') {
        formdata.append(key, data[key])
      } else {
        data['job'].forEach((el,i) => {
          formdata.append(`job[${i}]`, el)
        })
      }
    }
    //formdata.append('institution', inst)
    axios.post(`/users/edit/${id}`,formdata, {
        headers: {
          Accept: "text/json",
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(function (response) {
        dispatch(refreshSpecialist())
        dispatch(fetchSpecialist(id));
      });
}

export const fetchSelects = (instId, districtsId, jobsId, jobsCharsId, jobsTypesId, rolesLink = '/permissions/getUserTypes') => (dispatch)=> { 
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
    .get(`/guides/list_items/${districtsId}/0/0/0/0/1`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setSpecialist({source: {districtsArr: response.data.data}}));
    });
    axios
    .get(`/guides/list_items/20/0/0/0/0/1`, {
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
    axios
    .get(rolesLink, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      let key
      const tempArr = []
      for (key in response.data) {
        if (key !== '_user' && key !== '_benchmarks' ) {
          tempArr.push({name: response.data[key], id: response.data[key]})
        }
      }
      dispatch(setSpecialist({source: {rolesArr: tempArr}}));
    });
}

export const addSpecialist = (data) => {
  var formdata = new FormData();
  let key
  for (key in data){
    if (key !== 'job') {
      formdata.append(key, data[key])
    } else {
      data['job'].forEach((el,i) => {
        formdata.append(`job[${i}]`, el)
      })
    }
  }
  axios.post(`/users/userAdd/`,formdata, {
      headers: {
        Accept: "text/json",
        'Content-Type': 'multipart/form-data'
      },
    })
    .then(function (response) {
      if (response.data.success === false) {
        alert(response.data.info)
      }
    });
}

export default specialistReducer;
