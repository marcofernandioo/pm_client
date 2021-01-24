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

import {getPricelist, deleteProduct, editProduct} from '../api';

export default function Pricelist () {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [id, setId] = useState({});

    const columns = [
        // {
        //     name: 'category', 
        //     label: ' ', 
        //     options: {}
        // }, 
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
        filterType: 'checkbox'
    }

    const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'IDR'});
    function formatCurrency(num) {
        let res = formatter.format(num).split('IDR');
        res = res.slice(1);
        return `Rp.${res}`
    }
    
    useEffect(() => {
        loadPricelist();
        console.log(products);

    }, []);

    const loadPricelist = () => {
        getPricelist()
        .then(res => {
            if (res.data.status == 'ok') {
                for (let i = 0; i < res.data.list.length; i++) {
                    let product = res.data.list[i];
                    product.strPrice = formatCurrency(product.price);
                }
                setProducts(res.data.list);

                // console.log(res.data);
            }
            else alert(res.data.msg);
        })
        .catch(() => console.log('Coba ulangi kembali'));
    }

    const redirectToEditProduct = (id) => {
        window.location.href = '/edit/'+id
    }

    const onDeleteProduct = (id) => {
        deleteProduct(id)
        .then((res) => {
            // console.log(res);
            if (res.data.status == 'ok') setOpen(false);
            else alert(res.data.msg);
        })
        .catch(err => console.log(err));
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
                onClick = {() => window.location.href = '/add'}
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
        </>
    )
}           