import axios from 'axios';
import FormData from 'form-data';

const baseURL = 'http://39.106.229.224'
const axiosInstance = axios.create();
const api = {

  adminListRepos: (page, pageSize) => {
    const url = baseURL + '/api/v1/admin/repos';
    return axiosInstance.get(url);
  },
  adminAddRepo: (name, repoURL) => {
    const url = baseURL + '/api/v1/admin/repos';
    let form = new FormData();
    form.append('name', name);
    form.append('url', repoURL);
    return axiosInstance.post(url, form);
  },
  adminUpdateRepo: (id, name, repoURL) => {
    const url = baseURL + '/api/v1/admin/repos/' + id;
    let form = new FormData();
    if (name !== '') form.append('name', name);
    if (repoURL !== '') form.append('url', repoURL);
    return axiosInstance.put(url, form);
  },
  adminDeleteRepo: (id) => {
    const url = baseURL + '/api/v1/admin/repos/' + id;
    return axiosInstance.delete(url);
  },
  listRepos: () => {
    const url = baseURL + '/api/v1/repos/';
    return axiosInstance.get(url);
  },
  getRepoDirentTree: (id) => {
    const url = baseURL + '/api/v1/repos/' + id + '/dirent-tree';
    return axiosInstance.get(url);
  },
  getRepoFile: (id, path) => {
    const url = baseURL + '/api/v1/repos/' + id + '/file';
    let params = {
      path: path,
    }
    return axiosInstance.get(url, {params:params});
  },
  getGithubMarkdownRendered: (fileString) => {
    console.log('fileString = ', fileString)
    const url = 'https://api.github.com/markdown';
    let data = {
      'text': fileString
    }
    return axiosInstance.post(url, data);
  }
}

export default api;