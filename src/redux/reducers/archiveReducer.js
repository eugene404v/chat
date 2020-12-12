import axios from "axios";

const initialState = {
  isLoaded: false,
  archivesPage: 1
};

const archiveReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_ARCHIVES": {
          return {
            ...state,
            archives: action.archives,
            archivesPage: action.page,
          };
        }
        case "CLEAR_ARCHIVES": {
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
      type: "SET_ARCHIVES",
      archives: array,
      page,
    };
  };
  
  export const clearArchives = () => {
    return {
      type: "CLEAR_ARCHIVES",
    };
  };
  
  export const fetchArchives = (page) => (dispatch) => {
    axios
      .get(`/archiving/lists?page=${page}`, {
        headers: {
          Accept: "text/json",
        },
      })
      .then(function (response) {
        dispatch(clearArchives());
        dispatch(setArchives(response.data, page));
      });
  };

export default archiveReducer