import axios from "axios";

const initialState = {
  isLoaded: false,
  _user: false,
  activityPage: 1,
  usersPage: 1
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ME": {
      return {
        ...state,
        ...action.data,
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
      dispatch(setMe(response.data));
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
    .get(`/history/lists?page=${page}`, {
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
    .get(`/users/allUsers?page=${page}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      dispatch(clearLkUsers());
      dispatch(setLkUsers(response.data, page));
    });
};

export default userReducer;
