import axios from "axios";

const initialState = {
    isLoaded: false,
    docs: [{
        id: 1,
        name: "1",
        file: "1",
        author: {fio:"1", id: 1},
        date: "22-22-2222",
      }],
      page: 1
};

const documentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DOCS": {
      return {
        ...state,
        docs: [...action.data.data],
        user: {...action.data._user},
        total: action.data.total,
        isLoaded: true
      };
    }
    case "REFRESH_DOCS": {
        return {
          ...state,
          isLoaded: false
        };
      }
      case "SET_DOCS_PAGE": {
          return {
              ...state,
              page: action.page
          }
      }
      case "CLEAR_DOCS": {
          return {
              ...state,
              docs: null
          }
      }
    default:
      return state;
  }
};

export const fetchDocs = (page) => (dispatch) => {
  axios
    .get(`/documents/lists/0/1?page=${page}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {

      if (response.data._user) {
        dispatch(clearDocs())
        dispatch(setDocs(response.data));
        dispatch(setDocsPage(page))
      } else {
        window.location.replace('/login')
      }
    });
};

export const setDocs = (data) => {
    return {
        type: 'SET_DOCS',
        data
    }
}

export const refreshDocs = () => {
    return {
        type: 'REFRESH_DOCS'
    }
}

export const addDocs = (data, page) => (dispatch) => {
    var formdata = new FormData();
    let key
    for (key in data){
        formdata.append(key, data[key])
    }  
    axios.post(`/docs/add`, formdata, {
        headers: {
          'Accept': "text/json",
          'Content-Type': 'multipart/form-data'
        },
      }).then(function (response) {
        dispatch(refreshDocs())
        dispatch(fetchDocs(page));
      })
}

export const setDocsPage = (page) => {
    return {
        type: 'SET_DOCS_PAGE',
        page
    }
}

const clearDocs = () => {
    return {
        type: 'CLEAR_DOCS',
    }
}


export default documentsReducer