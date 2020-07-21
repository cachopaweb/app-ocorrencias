import axios from 'axios';

const api = axios.create({ baseURL: 'https://portalsoft.net.br' });

// const api = axios.create({ baseURL: 'http://localhost:9000' });

export default api;