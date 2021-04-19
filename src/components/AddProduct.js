import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Loading from './Loading';
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
        marginBottom: '10px', 
        width: '80%'
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
    const [price, setPrice] = useState(1000);
    const [cost, setCost] = useState(1000);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const onSubmitProduct = (name, price) => {
        setLoading(true);
        addProduct(name, price, cost)
        .then((res) => {
            if (res.data.status === 'ok') {
                setLoading(false); 
                window.location.href = '/#/pricelist';
            }
            else alert(res.data.msg); setLoading(false);
        })
        .catch((err) => alert('Coba ulangi kembali'))
    }

    return (
        <>
            <Card className = {classes.myCard}>
                <CardContent>
                    <Grid
                        container
                        style = {{marginLeft: '20px'}}
                    >
                        <h2 style = {{marginRight: '25px'}}>Tambahkan Produk Baru</h2>
                        <Grid container item alignItems = 'center'>
                            <Grid item sm = {2} xs = {12} >
                                Nama Produk
                            </Grid>
                            <Grid item sm = {10} xs = {12}>
                                <TextField 
                                    type = "text" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    value = {name}
                                    onChange = {(e) => setName(e.target.value)}
                                    placeholder = "contoh. Mangga Harum Manis"
                                />
                            </Grid>
                        </Grid>
                        <Grid container item alignItems = 'center'>
                            <Grid item sm = {2} xs = {12} >
                                Harga Jual
                            </Grid>
                            <Grid item sm = {10} xs = {12}>
                                <TextField 
                                    type = "number" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    InputProps = {{inputProps: {min: 0}}}
                                    onChange = {(e) => setPrice(e.target.value)}
                                    value = {price}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item alignItems = 'center'>
                            <Grid item sm = {2} xs = {12} >
                                Modal
                            </Grid>
                            <Grid item sm = {10} xs = {12}>
                                <TextField 
                                    type = "number" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    InputProps = {{inputProps: {min: 0}}}
                                    onChange = {(e) => setCost(e.target.value)}
                                    value = {cost}
                                />
                            </Grid>
                        </Grid>
                        <div style = {{marginTop: '10px', marginRight: '25px'}}>
                            <Button
                                variant = "contained"
                                onClick = {() => window.location.href = '/#/pricelist'}
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
                        </div>
                        
                    </Grid>
                </CardContent>
            </Card>
            <Loading open = {loading} />
        </>
    )
}