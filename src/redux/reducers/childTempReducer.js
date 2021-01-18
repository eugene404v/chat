import axios from "axios";

const initialState = {
};

const childTempReducer = (state, action) => {
    switch (action.type) {
        case "SET_PROF_LAST_SELECT_NEW": {
          return {
            ...state,
            reasonArr: action.arr
          };
        }
        case "CLEAR_PROF_LAST_SELECT_NEW": {
            return {
              ...state,
              reasonArr: null
            };
          }
        default:
          return initialState;
      }
}
export const fetchProfSelectLastNew = (start, typeId) => (dispatch) => {
  const status = start === 'Поставлен' ? 0 : 1;
  console.log({status});
  axios.get(`/children/loadSelect/prof?forEnd=${status}&profType=${typeId}`, {
    headers: {
      Accept: "text/json",
    },
  })
  .then(response => dispatch(setLastSelect( response.data.data )))
  .then(response => console.log(response))
}
  
  export const clearArchives = () => {
    return {
      type: "CLEAR_PROF_LAST_SELECT_NEW",
    };
  };
  
const setLastSelect = (arr) => {
    return {
        type: 'SET_PROF_LAST_SELECT_NEW',
        arr
    }
}

export default childTempReducer