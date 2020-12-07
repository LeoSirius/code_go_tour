

const util = {
  getErrMsg: (error) => {
    if (error.response) {
      if (error.response.data && error.response.data.message) {
        return error.response.data.message;
      }
      return error.response.statusText;
    }
    return 'network error';
  },
}

export default util;