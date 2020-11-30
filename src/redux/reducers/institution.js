import axios from "axios";

const initialState = {
    isLoaded: false,
  address: "no",
  district: "",
  fullName: "WWWWWWW",
  name: "",
  lead: {},
  operator: {},
};

const institutionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_INSTITUTION": {
      return {
        ...state,
        ...action.data,
        isLoaded: true
      };
    }

    default:
      return state;
  }
};

export const fetchInstitution = (id) => (dispatch) => {
  axios
    .get(`/institution/view/${id}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setInstitution(response.data.source));
    });
};

export const setInstitution = (data) => {
    return {
        type: 'SET_INSTITUTION',
        data
    }
}

export const editInstitution = (data, id) => (dispatch) => {
    const formData = {}
    var formdata = new FormData();
    let key
    for (key in data){
        formdata.append(key, data[key])
    }
    console.log(formdata.get('address'))
    axios.post(`/institution/edit/${id}`,formdata, {
        headers: {
          //Accept: "text/json",
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(function (response) {
        dispatch(setInstitution(response.data.source));
      });
}

export default institutionReducer;
