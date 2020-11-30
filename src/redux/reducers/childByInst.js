import axios from "axios";

const initialState = {
    isLoaded: false,
  children: [],
  
};

const childByInst = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CHILD_BY_INST": {
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

export const fetchChildByInst = (id) => (dispatch) => {
  axios
    .get(`/children/filter/institution/${id}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setChildByInst(response.data));
    });
};

export const setChildByInst = (data) => {
    return {
        type: 'SET_CHILD_BY_INST',
        data
    }
}

/*export const editInstitution = (data, id) => (dispatch) => {
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
}*/

export default childByInst;
