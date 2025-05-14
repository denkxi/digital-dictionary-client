// Mock implementation of axiosBaseQuery
const axiosBaseQuery = () => async ({ url, method, data, params }) => {
    return {
      data: {}
    };
  };
  
  export default axiosBaseQuery;
  