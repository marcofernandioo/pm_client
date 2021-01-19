import React, {useState, useEffect} from 'react';
import MUIDataTable from 'mui-datatables';
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import {getPricelist, deleteProduct, editProduct} from '../api';

export default function Pricelist () {
    const [products, setProducts] = useState([]);
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
            name: 'price', 
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
                            <Tooltip title = "Edit Product">
                                <IconButton>
                                    <EditIcon onClick = {() => redirectToEditProduct(id)}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title = "Delete Product">
                                <IconButton>
                                    <DeleteIcon onClick = {() => console.log(id)}/>
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

    useEffect(() => {
        loadPricelist();
    }, []);

    const loadPricelist = () => {
        getPricelist()
        .then(res => {
            if (res.data.status == 'ok') setProducts(res.data.list);
            else alert('Coba ulang kembali');
        })
        .catch(err => console.log(err));
    }

    const redirectToEditProduct = (id) => {
        window.location.href = '/dashboard/edit/'+id
    }

    const onDeleteProduct = (id) => {
        alert(id);
    }

    return (
        <>
            <Button 
                style = {{marginBottom: '10px'}}
                variant = "contained" 
                color = "primary"
                // component = {Link}
                // to = "/home/addtask"
                onClick = {() => window.location.href = '/dashboard/add'}
            >
                Tambahkan produk
            </Button>
            <MUIDataTable 
                title = "Pricelist"
                data = {products}
                columns = {columns}
                options = {options}
            />
        </>
    )
}           