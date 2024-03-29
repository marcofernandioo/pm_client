
import React, {useState, useEffect} from 'react';
import 'date-fns';
import {format} from 'date-fns';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import {makeStyles} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DateFnsUtils from '@date-io/date-fns';
import {nextDay} from 'date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Checkbox from '@material-ui/core/Checkbox';

import {useParams} from 'react-router-dom';

import _ from 'lodash';

import Loading from './Loading';
import {getPricelist, findOrder, updateOrder} from '../api';

const useStyles = makeStyles((theme) => ({
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
    }, 
    alert: {
        width: '100%',
        '& > * + *': {
          marginTop: theme.spacing(2),
        },
    },
}))

export default function EditOrder () {
    const classes = useStyles();
    const [list, setList] = useState([]);
    const [customer, setCustomer] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [sendDate, setSendDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [paid, setPaid] = useState(false);
    const [ongkir, setOngkir] = useState(0)
    const [subtotal, setSubtotal] = useState(0);
    const [loading, setLoading] = useState(false);

    let {id} = useParams();

    const columns = [
        {
            name: 'name',
            label: 'Produk'
        }, 
        {
            name: 'qty',
            label: 'Quantity',
            options: {
                customBodyRender: (value, meta) => {
                    return (
                        <TextField 
                            value = {value}
                            defaultValue = {3}
                            variant = "outlined"
                            type = "number"
                            InputProps = {{inputProps: {min: 0}}}
                            onChange = {(e) => onUpdateQty(meta.rowIndex, e.target.value)}
                        />
                    )
                }
            }
        },
        {
            name: 'strPrice',
            label: 'Harga',
        }, 
        {
            name: 'desc', 
            label: 'Keterangan', 
            options: {
                customBodyRender: (value, meta) => {
                    return (
                        <TextField 
                            value = {value}
                            variant = "outlined"
                            type = "text"
                            onChange = {(e) => onUpdateDesc(meta.rowIndex, e.target.value)}
                        />
                    )
                }
            }
        },
    ]

    useEffect(() => {
        setLoading(true);
        findOrder(id)
        .then((res) => {
            if (res.data.status == 'ok') {
                let data = res.data.msg;
                setCustomer(data.buyer);
                setAddress(data.address);
                setContact(data.contact);
                setSendDate(data.sendDate);
                setOngkir(data.ongkir);
                setPaid(data.paid);
                for (let i = 0; i < res.data.msg.fakelist.length; i++) {
                    let product = res.data.msg.fakelist[i];
                    product.strPrice = formatCurrency(product.price);
                }
                setList(data.fakelist);
                setSubtotal(data.subtotal);
                setLoading(false);
            } else alert(res.data.msg); setLoading(false);
        })
    }, []);

    const handleDateChange = (date) => {
        setSendDate(date);
    }

    const onUpdateQty = (rowIndex, qty) => {
        let updateProducts = [ ...list ];
        let price = updateProducts[rowIndex].price;
        updateProducts[rowIndex].qty = qty;
        updateProducts[rowIndex].total = qty * price;
        setList(updateProducts);
    }

    const onUpdateDesc = (rowIndex, text) => {
        let updateProducts = [ ...list ];
        updateProducts[rowIndex].desc = text;
        setList(updateProducts);
    }

    const onSave = (customer, address, contact, paid, ongkir, sendDate, subtotal) => {
        setLoading(true);
        updateOrder(id, customer, address, contact, paid, ongkir, sendDate, subtotal)
        .then((res) => {
            if (res.data.status == 'ok') window.location.href = '/#/rekap';
            setLoading(false);
            alert(res.data.msg);
        })
        .catch((err) => alert(err));
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const handleClose = (reason) => {
        setCustomer('');
        setAddress('');
        setContact('');
        setOpen(false);
        if (reason === 'clickaway'){
            return;
        }
        window.location.href = '/'
    }

    const handleChecks = (e) => {
        setPaid(e.target.checked);
    }


    const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'IDR'});
    function formatCurrency(num) {
        let res = formatter.format(num).split('IDR');
        res = res.slice(1);
        return `Rp.${res}`
    }

    return (
        <> 
            <div className = {classes.alert}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} color="success">
                        Orderan telah tercatat! 
                    </Alert>
                </Snackbar>
            </div>
                
            <Card>
                <CardContent>
                    <Grid
                        container
                        style = {{marginLeft: '20px'}}
                    >
                        <h2>Ubah Orderan Customer</h2>
                        <Grid container item alignItems = 'center'>
                            <Grid item md = {2} xs = {12} >
                                Customer
                            </Grid>
                            <Grid item md = {10} xs = {12}>
                                <TextField 
                                    type = "text" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    value = {customer}
                                    onChange = {(e) => setCustomer(e.target.value)}
                                />
                            </Grid>
                            
                        </Grid>
                        <Grid container item alignItems = 'center'>
                            <Grid item md = {2} xs = {12} >
                                Contact
                            </Grid>
                            <Grid item md = {10} xs = {12}>
                                <TextField 
                                    type = "text" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    value = {contact}
                                    onChange = {(e) => setContact(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item alignItems = 'center'>
                            <Grid item md = {2} xs = {12} >
                                Alamat
                            </Grid>
                            <Grid item md = {10} xs = {12}>
                                <TextField 
                                    type = "text" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    value = {address}
                                    onChange = {(e) => setAddress(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item alignItems = 'center'>
                            <Grid item md = {2} xs = {12} >
                                Ongkir
                            </Grid>
                            <Grid item md = {10} xs = {12}>
                                <TextField 
                                    type = "number" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    value = {ongkir}
                                    onChange = {(e) => setOngkir(e.target.value)}
                                    InputProps = {{inputProps: {min: 0}}}
                                ></TextField>
                            </Grid>
                        </Grid>
                        <Grid container item alignItems = 'center'>
                            <Grid item md = {2} xs = {12} >
                                Tanggal Pengiriman
                            </Grid>
                            <Grid item md = {10} xs = {12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="dd/MM/yyyy"
                                        margin="normal"
                                        value={sendDate}
                                        onChange={(e) => handleDateChange(e)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                        <Grid container item alignItems = 'center'>
                            <Grid item sm = {2} xs = {12} >
                                Sudah Dibayar
                            </Grid>
                            <Grid item sm = {10} xs = {12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Checkbox
                                            checked={paid}
                                            onChange={handleChecks}
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                        <Button
                            variant = "contained"
                            onClick = {() => window.location.href = '/#/rekap'}
                            style = {{marginTop: '20px', marginRight: '20px'}}
                        >
                            kembali
                        </Button>
                        <Button
                            variant = "contained"
                            onClick = {() => onSave(customer, address, contact,paid, ongkir, sendDate, subtotal)}
                            color = "secondary"
                            style = {{marginTop: "20px"}}
                        >
                            Ubah
                        </Button>
                    </Grid>
                </CardContent>
            </Card>
            <Loading open = {loading} />
        </>
    )
}