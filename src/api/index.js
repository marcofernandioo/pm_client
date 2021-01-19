import axios from 'axios';

const URL = 'http://localhost:8001';

axios.defaults.withCredentials = true;

export function getPricelist() {
    return new Promise ((resolve,reject) => {
        var url = `${URL}/pricelist/get`;
        axios.get(url)
        .then(res => resolve(res))
        .catch(err => reject(err));
    })
}

export function getProduct (id) {
    return new Promise ((resolve,reject) => {
        var url = `${URL}/pricelist/find/${id}`;
        axios.get(url)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    })
}