import axios from "axios";

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
    asylum: false,
    asylumId: 0,

};

const childReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CHILD": {
      return {
        ...state,
        ...action.data.source,
        isLoaded: true
      };
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
      dispatch(setChild(response.data));
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
    const formData = {}
    var formdata = new FormData();
    let key
    for (key in data){
        formdata.append(key, data[key])
    }
    axios.post(`/children/edit/${id}`,formdata, {
        headers: {
          //Accept: "text/json",
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(function (response) {
        dispatch(setChild(response.data.source));
      });
}

export default childReducer;
