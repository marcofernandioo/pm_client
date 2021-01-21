import axios from 'axios';
import { az } from 'date-fns/esm/locale';

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

export function editProduct (id, name, category, price) {
    return new Promise((resolve,reject) => {
        var url = `${URL}/pricelist/update`;
        axios.post(url, {id, name, category, price})
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
}

export function deleteProduct (id) {
    return new Promise ((resolve,reject) => {
        var url = `${URL}/pricelist/delete/${id}`;
        axios.get(url)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
}

export function addProduct(name,category, price) {
    return new Promise((resolve,reject) => {
        var url = `${URL}/pricelist/add`;
        axios.post(url, {name, category, price})
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
}

export function addOrder (buyer, address, contact, basket) {
    return new Promise ((resolve,reject) => {
        var url = `${URL}/order/add`;
        axios.post(url, {buyer, address, contact, basket})
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
}