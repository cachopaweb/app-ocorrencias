import axios from 'axios';

const api = axios.create({ baseURL: 'https://portalsoft.net.br' });//api Delphi com Horse

// const api = axios.create({ baseURL: 'http://localhost:9000' });//api Delphi com Horse

export default api;
