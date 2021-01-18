import React, {useState, useEffect} from 'react';
import MUIDataTable from 'mui-datatables';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import {getPricelist} from '../api';

export default function Pricelist () {
    const [products, setProducts] = useState([]);
    const columns = [
        {
            name: 'category', 
            label: 'Buah', 
            options: {}
        }, 
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
                                    <EditIcon onClick = {() => alert(id)}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title = "Delete Product">
                                <IconButton>
                                    <DeleteIcon onClick = {() => alert(id)}/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    )
                }
            }
        }

    ]

    useEffect(() => {
        loadProductlist();
    }, []);

    const loadProductlist = () => {
        getPricelist()
        .then(res => {
            // console.log(res);
            setProducts(res.data.pricelist);
        })
        .catch(err => console.log(err))
    }

    return (
        <>
            <MUIDataTable 
                title = "Pricelist"
                data = {products}
                columns = {columns}
                // options = {options}
            />
        </>
    )
}           