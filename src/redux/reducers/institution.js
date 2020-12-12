import axios from "axios";
import moment from 'moment'

const initialState = {
    isLoaded: false,
  address: "no",
  district: "",
  fullName: "WWWWWWW",
  name: "",
  lead: {},
  operator: {},
  tableData: [{}]
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
      dispatch(setInstitution(response.data.source))
      dispatch(setInstitution({tableData: [{
        key:1,
        countSpecs: response.data.countSpecs,
        allChildren: response.data.countChildren.totalChildren,
        2: response.data.countChildren.byProfs[2].count,
        3: response.data.countChildren.byProfs[3].count,
        4: response.data.countChildren.byProfs[4].count,
        5: response.data.countChildren.byProfs[5].count,
        6: response.data.countChildren.byProfs[6].count,
        7: response.data.countChildren.byProfs[7].count,
        8: response.data.countChildren.byProfs[8].count,
        9: response.data.countChildren.byProfs[9].count,
      }]}))
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
      if (key != "orderDate") {
        formdata.append(key, data[key]);
      } else if (key == "orderDate") {
        formdata.append(key, moment(data[key]).format("YYYY-MM-DD").toString());
      } 
    }
    console.log(formdata.get('address'))
    axios.post(`/institution/edit/${id}`,formdata, {
        headers: {
          Accept: "text/json",
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(function (response) {
        dispatch(setInstitution(response.data.source));
      });
}

export const fetchSelects = (districtsId) => (dispatch) => {
  axios
    .get(`/guides/list_items/${districtsId}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(setInstitution({  districtsArr: response.data.data  }));
    });
  axios
    .get(`/institution/loadUsers/leads`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      let tempArr = response.data.data
      tempArr = tempArr.map(el =>  {return{...el, name: el.fio}})
      dispatch(setInstitution({  leadsArr: tempArr  }));
    });
  axios
    .get(`/institution/loadUsers/operators`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      let tempArr = response.data.data
      tempArr = tempArr.map(el =>  {return{...el, name: el.fio}})
      dispatch(setInstitution({  operatorsArr: tempArr  }));
    });
};

export const addInstitution = (data) => (dispatch) => {
  var formdata = new FormData();
  let key
  for (key in data){
    if (key != "orderDate") {
      formdata.append(key, data[key]);
    } else if (key == "orderDate") {
      formdata.append(key, moment(data[key]).format("YYYY-MM-DD").toString());
    } 
  }
  console.log(formdata.get('address'))
  axios.post(`/institution/add`,formdata, {
      headers: {
        Accept: "text/json",
        'Content-Type': 'multipart/form-data'
      },
    })
    .then(function (response) {
      console.log(response.data.source);
    });
}

export default institutionReducer;
