import axios from 'axios';

const URL = 'https://pasar-medan.herokuapp.com';

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

export function addOrder (buyer, address, contact, basket, paid, ongkir, sendDate, fakelist) {
    let intOngkir = parseInt(ongkir);
    return new Promise ((resolve,reject) => {
        var url = `${URL}/order/add`;
        axios.post(url, {buyer, address, contact, basket, paid, ongkir: intOngkir, sendDate, fakelist})
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
}

export function getBaskets() {
    return new Promise((resolve, reject) => {
        var url = `${URL}/order/baskets`;
        axios.get(url)
        .then((res) => resolve(res))
        .catch((err) => reject(err)); 
    })
}

export function getOrderData() {
    return new Promise((resolve, reject) => {
        var url = `${URL}/order/data`;
        axios.get(url)
        .then((res) => resolve(res))
        .catch((err) => reject(err)); 
    })
}

export function getDateOrders(date) {
    return new Promise ((resolve, reject) => {
        var url = URL+'/order/find?date='+date;
        axios.get(url)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
}

export function deleteOrder (id) {
    return new Promise ((resolve, reject) => {
        var url = `${URL}/order/delete/${id}`;
        axios.get(url)
        .then(res => resolve(res))
        .catch(err => reject(err));
    })
}

export function updateOrder (id, buyer, address, contact, basket, paid, ongkir, sendDate) {
    let intOngkir = parseInt(ongkir);
    return new Promise ((resolve,reject) => {
        var url = `${URL}/order/update`;
        axios.post(url, {id, buyer, address, contact, basket, paid, ongkir: intOngkir, sendDate})
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
}

export function findOrder(id) {
    return new Promise((resolve,reject) => {
        var url = `${URL}/order/findone/${id}`;
        axios.get(url)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
}

export function dummy (fakelist) {
    return new Promise((resolve,reject) => {
        var url = `${URL}/order/dummy`;
        axios.post(url, {fakelist})
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
}