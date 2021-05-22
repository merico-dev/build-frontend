import http from '@/utils/http'

export const fetchData = async (endpoint, payload) => {
  try {
    const { data } = await http.get(endpoint, payload)
    return data
  } catch (e) {
    throw new Error(`Unable to fetch data from ${endpoint}. Exited with the following ${e.message}`)
  }
}

export const postData = async (endpoint, payload, headers = {}, useApiError = false) => {
  try {
    const { data } = await http.post(endpoint, payload, headers)
    return data
  } catch (e) {
    throw new Error(useApiError
      ? e.response.data.error.message
      : `Unable to post data to ${endpoint}. Exited with the following ${e.message}`)
  }
}

export const deleteData = async (endpoint, payload) => {
  try {
    const { data } = await http.delete(endpoint, payload)
    return data
  } catch (e) {
    throw new Error(`Unable to delete data from ${endpoint}. Exited with the following ${e.message}`)
  }
}
