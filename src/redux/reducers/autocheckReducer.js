import axios from "axios";

const initialState = {
  isLoaded: false,
  archivesPage: 1
};

const autocheckReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_AUTOCHECKS": {
            let tempArr = action.archives.data.map(el => {
                return {
                    ...el,
                    errors: JSON.parse(el.errors)
                }
            })
          return {
            ...state,
            archives: tempArr,
            total: action.archives.total,
            archivesPage: action.page,
          };
        }
        case "CLEAR_AUTOCHECKS": {
          return {
            ...state,
            archives: null,
          };
        }
        default:
          return state;
      }
}

export const setArchives = (array, page) => {
    return {
      type: "SET_AUTOCHECKS",
      archives: array,
      page,
    };
  };
  
  export const clearArchives = () => {
    return {
      type: "CLEAR_AUTOCHECKS",
    };
  };
  
  export const fetchArchives = (page) => (dispatch) => {
    axios
      .get(`/autocheck/lists?page=${page}`, {
        headers: {
          Accept: "text/json",
        },
      })
      .then(function (response) {
        if (response.data._user) {
          dispatch(clearArchives());
          dispatch(setArchives(response.data, page));
        } else {
          window.location.replace('/login')
        }
      });
  };

export default autocheckReducer