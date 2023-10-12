import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

export const fetchTodos = async () => {
    return axios.get('/todos');
};

export const fetchCommits = async () => {
    return axios.get('/commits');
};

export const fetchCommitDataByDate = async () => {
    return axios.get('/commitDataByDate');
}

export const fetchContributions = async () => {
    return axios.get('/contributionDays');
}