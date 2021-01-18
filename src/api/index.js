import axios from 'axios';

const URL = 'http://localhost:8001';

axios.defaults.withCredentials = true;

export function getPricelist() {
    return new Promise ((resolve,reject) => {
        const url = `${URL}/pricelist/get`;
        axios.get(url)
        .then(res => resolve(res))
        .catch(err => reject(err));
    })
}