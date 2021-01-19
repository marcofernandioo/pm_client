import { set } from 'date-fns/esm';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import {getProduct} from '../api';

const useStyles = makeStyles(() => ({
    columnData: {
        width: '600px'
    }, 
    columnName: {
        width: '200px'
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',   
        width: '100%'
    }, 
    grid: {
        marginLeft: '20px'
    }, 
    myCard: {
        width: '100%',  
    }, 
    myButton: {
        backgroundColor: '#00cccc', 
        color: '#ffffff'
    }, 
    textField: {
        marginTop: '10px',   
        marginBottom: '10px'
    }, 
    root: {
        flexDirection: 'column',   
        justifyContent: 'flex-start', 
        alignItems: 'flex-start', 
        height: '100vh', 
        width: '900px', 
        marginLeft: '80px', 
        marginTop: '80px'
    }
}))

export default function EditProduct () {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0);

    let {id} = useParams();
    const classes = useStyles();

    useEffect(() => {
        getProduct(id)
        .then((res) => {
            if (res.data.status == 'ok') {
                setName(res.data.product.name);
                setCategory(res.data.product.category);
                setPrice(res.data.product.price);
            }
            else alert(res.data.msg);
            
        })
        .catch((err) => console.log(err));
    }, []);

    const onEditProduct = () => {
        
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Grid>
                        <h2>Edit Produk</h2>
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Nama Buah</div>
                            <div className = {classes.columnData}> 
                                <TextField 
                                    type = "text" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    value = {name}
                                    onChange = {(e) => setName(e.target.value)}
                                    
                                />
                            </div>
                        </div>
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Jenis Buah</div>
                            <div className = {classes.columnData}> 
                                <TextField 
                                    type = "text" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    onChange = {(e) => setCategory(e.target.value)}
                                    value = {category}
                                />
                            </div>
                        </div>
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Harga Jual</div>
                            <div className = {classes.columnData}> 
                                <TextField 
                                    type = "number" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    onChange = {(e) => setPrice(e.target.value)}
                                    value = {price}
                                />
                            </div>
                        </div>
                        <Button
                            variant = "contained"
                            onClick = {() => window.location.href = '/dashboard/pricelist'}
                            style = {{marginRight: '20px'}}
                        >
                            kembali
                        </Button>
                        <Button
                            variant = "contained"
                            onClick = {onEditProduct}
                            color = "secondary"
                        >
                            Edit
                        </Button>

                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}