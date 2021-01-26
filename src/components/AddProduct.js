import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import {addProduct} from '../api';

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

export default function AddProduct () {
    const [name, setName] = useState('');
    // const [category, setCategory] = useState('');
    const [price, setPrice] = useState(1000);

    const classes = useStyles();

    const onSubmitProduct = (name, category, price) => {
        addProduct(name, category, price)
        .then((res) => {
            if (res.data.status == 'ok') window.location.href = '/pricelist'
            else alert(res.data.msg);
        })
        .catch((err) => alert('Coba ulangi kembali'))
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Grid>
                        <h2>TAMBAHKAN PRODUK BARU</h2>
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Nama Lengkap Buah</div>
                            <div className = {classes.columnData}> 
                                <TextField 
                                    type = "text" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    value = {name}
                                    onChange = {(e) => setName(e.target.value)}
                                    placeholder = "contoh. Mangga Harum Manis"
                                />
                            </div>
                        </div>
                        {/* <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Jenis Buah</div>
                            <div className = {classes.columnData}> 
                                <TextField 
                                    type = "text" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    onChange = {(e) => setCategory(e.target.value)}
                                    value = {category}
                                    placeholder = "contoh: Mangga"
                                />
                            </div>
                        </div> */}
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Harga Jual</div>
                            <div className = {classes.columnData}> 
                                <TextField 
                                    type = "number" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    InputProps = {{inputProps: {min: 0}}}
                                    onChange = {(e) => setPrice(e.target.value)}
                                    value = {price}
                                />
                            </div>
                        </div>
                        <Button
                            variant = "contained"
                            onClick = {() => window.location.href = '/pricelist'}
                            style = {{marginRight: '20px'}}
                        >
                            kembali
                        </Button>
                        <Button
                            variant = "contained"
                            onClick = {() => onSubmitProduct(name, price)}
                            color = "secondary"
                        >
                            tambah
                        </Button>

                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}