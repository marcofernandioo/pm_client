import React, {useState, useEffect} from 'react';
import MUIDataTable from 'mui-datatables';
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Loading from './Loading';
import {getPricelist, deleteProduct} from '../api';

import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());
export default function Pricelist () {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [id, setId] = useState({});
    const [loading, setLoading] = useState(false);

    const URL = 'https://pasar-medan.herokuapp.com/order/all';
    const {pricelist} = useSWR(URL, fetcher);
    console.log(pricelist);


    const columns = [
        {

            name: 'name', 
            label: 'Produk', 
            options: {}
        }, 
        {
            name: 'strPrice', 
            label: 'Harga Jual', 
            options: {}
        },
        {
            name: 'strCost', 
            label: 'Modal',
            options: {}
        },
        {
            name: '_id', 
            label: ' ', 
            options: {
                filter: false, 
                sort: false, 
                customBodyRender: (id) => {
                    return (
                        <div>
                            <Tooltip title = "Ubah Produk">
                                <IconButton>
                                    <EditIcon onClick = {() => redirectToEditProduct(id)}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title = "Hapus Produk">
                                <IconButton>
                                    <DeleteIcon onClick = {() => handleClickOpen(id)}/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    )
                }
            }
        }
    ]

    const options = {
        filterType: 'checkbox', 
        responsive: 'standard'
    }

    const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'IDR'});
    function formatCurrency(num) {
        let res = formatter.format(num).split('IDR');
        res = res.slice(1);
        return `Rp.${res}`
    }
    
    useEffect(() => {
        setLoading(true);
        loadPricelist();
    }, []);

    const loadPricelist = () => {
        getPricelist()
        .then(res => {
            if (res.data.status === 'ok') {
                for (let i = 0; i < res.data.list.length; i++) {
                    let product = res.data.list[i];
                    product.strPrice = formatCurrency(product.price);
                    product.strCost = formatCurrency(product.cost);
                }
                setProducts(res.data.list);
                setLoading(false);
            }
            else alert(res.data.msg); setLoading(false);
        })
        .catch(() => alert('Coba ulangi kembali'));
    }

    const redirectToEditProduct = (id) => {
        window.location.href = '/#/product/edit/'+id
    }

    const onDeleteProduct = (id) => {
        deleteProduct(id)
        .then((res) => {
            if (res.data.status === 'ok') {
                setOpen(false);
                loadPricelist();
            }
            else alert(res.data.msg);
        })
        .catch(err => alert(err));
    }

    const handleClickOpen = (id) => {
        setId(id);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Button 
                style = {{marginBottom: '10px'}}
                variant = "contained" 
                color = "primary"
                onClick = {() => window.location.href = '/#/add'}
            >
                Tambahkan produk
            </Button>
            <MUIDataTable 
                title = "Pricelist"
                data = {products}
                columns = {columns}
                options = {options}
            />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Hapus Produk Ini?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Produk yang dihapus tidak dapat dibalikkan kembali.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Kembali
                </Button>
                <Button onClick={() => onDeleteProduct(id)} color="primary" autoFocus>
                    Hapus
                </Button>
                </DialogActions>
            </Dialog>
            <Loading open = {loading}/>
        </>
    )
}           