import axios from "axios";


const tempId = localStorage.getItem('userId')
let userId
!!tempId ? userId=tempId : userId = 0

const tempLvl = localStorage.getItem('userLvl')
let userLvl
!!tempLvl ? userLvl=tempLvl : userLvl = 0

const initialState = {
  isLoaded: false,
  _user: false,
  id: userId,
  lvl: userLvl,
  activityPage: 1,
  usersPage: 1
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ME": {
      return {
        ...state,
        ...action.data,
        lvl: action.data.type,
        isLoaded: true,
      };
    }
    case "REFRESH_ME": {
      return {
        ...state,
        isLoaded: false,
      };
    }
    case "SET_ACTIVITY": {
      return {
        ...state,
        activity: action.activity,
        activityPage: action.page,
      };
    }
    case "SET_ACTIVITY_PAGE": {
      return {
        ...state,
        activityPage: action.page,
      };
    }
    case "CLEAR_ACTIVITY": {
      return {
        ...state,
        activity: null,
      };
    }
    case "SET_LK_USERS": {
      return {
        ...state,
        users: action.users,
        usersPage: action.page,
      };
    }
    case "CLEAR_LK_USERS": { 
      return {
        ...state,
        users: null,
      };
    }
    case "CLEAR_ME": { 
      return {
        ...state,
        id: 0,
        lvl: false
      };
    }
    default:
      return state;
  }
};

export const fetchMe = () => (dispatch) => {
  axios
    .get(`/users/lk`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      if (response.data._user.id === 0 && window.location.pathname !== '/login') {
        window.location.replace('/login')
      } 
      if (response.data && response.data._user) {
        dispatch(setMe(response.data));
        localStorage.setItem('userId', response.data.id)
        localStorage.setItem('userLvl', response.data.type)
        return
      }
      
      
    });
};

export const setMe = (data) => {
  return {
    type: "SET_ME",
    data,
  };
};

export const refreshMe = () => {
  return {
    type: "REFRESH_ME",
  };
};

export const setActivity = (array, page) => {
  return {
    type: "SET_ACTIVITY",
    activity: array,
    page,
  };
};

export const clearActivity = () => {
  return {
    type: "CLEAR_ACTIVITY",
  };
};

export const fetchActivity = (page) => (dispatch) => {
  axios
    .get(`/history/lists?page=${page}&limit=30`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(clearActivity());
      dispatch(setActivity(response.data, page));
    });
};

export const setActivityPage = (page) => {
  return {
    type: "SET_ACTIVITY_PAGE",
    page,
  };
};

export const clearLkUsers = () => {
  return {
    type: "CLEAR_LK_USERS",
  };
};

export const setLkUsers = (array, page) => {
  return {
    type: "SET_LK_USERS",
    users: array,
    page,
  };
};

export const fetchLkUsers = (page) => (dispatch) => {
  axios
    .get(`/users/allUsers?page=${page}&limit=30`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(clearLkUsers());
      dispatch(setLkUsers(response.data, page));
    });
};

export const clearMe = () => {
  localStorage.removeItem('userId')
  return {
    type: 'CLEAR_ME'
  }
}

export default userReducer;
