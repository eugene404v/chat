import axios from "axios";

const initialState = {
    isLoaded: true,
    news: [{
        id: 1,
        name: "1",
        text: "1",
        author: {fio:"1", id: 1},
        date: "",
      }],
      page: 1
};

const newsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_NEWS": {
      return {
        ...state,
        news: [...action.data.data],
        user: {...action.data._user},
        total: action.data.total,
        isLoaded: true
      };
    }
    case "REFRESH_NEWS": {
        return {
          ...state,
          isLoaded: false
        };
      }
      case "SET_NEWS_PAGE": {
          return {
              ...state,
              page: action.page
          }
      }
      case "CLEAR_NEWS": {
          return {
              ...state,
              news: null
          }
      }
    default:
      return state;
  }
};

export const fetchNews = (page) => (dispatch) => {
  axios
    .get(`/news/lists/0/1?page=${page}`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      if (response.data._user.id != 0) {
        dispatch(clearNews())
        dispatch(setNews(response.data));
        response.data.page>0 ? dispatch(setNewsPage(page)) : dispatch(setNewsPage(1))
      } else {
        //window.location.replace('/login')
      }
        

    });
};

export const setNews = (data) => {
    return {
        type: 'SET_NEWS',
        data
    }
}

export const refreshNews = () => {
    return {
        type: 'REFRESH_NEWS'
    }
}

export const addNews = (data, page) => (dispatch) => {
    var formdata = new FormData();
    let key
    for (key in data){
        formdata.append(key, data[key])
    }  
    axios.post(`/news/add`, formdata, {
        headers: {
          'Accept': "text/json",
          'Content-Type': 'multipart/form-data'
        },
      }).then(function (response) {
        dispatch(refreshNews())
        dispatch(fetchNews(page));
      })
}

export const setNewsPage = (page) => {
    return {
        type: 'SET_NEWS_PAGE',
        page
    }
}

const clearNews = () => {
    return {
        type: 'CLEAR_NEWS',
    }
}


export default newsReducer