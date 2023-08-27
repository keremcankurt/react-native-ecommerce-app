import {get} from '../request';
const BASE_URL = "https://kckticaretapi.onrender.com/api/seller";

export const getSeller = (id) => get(`${BASE_URL}/getsingleseller/${id}`);
