/* 
    Perhaps we check whether URL contains id or not?
    If there is, we query that id, and display as an Edit Order Page,
    if not, we dont query the id, and display it as Input Order Page.

*/

import React, {useState, useEffect} from 'react';
import 'date-fns';
// import {format} from 'date-fns';
// import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import {makeStyles} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Checkbox from '@material-ui/core/Checkbox';


import _ from 'lodash';

import Loading from './Loading';
import {getPricelist, addOrder} from '../api';

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

export default function Input () {
    const classes = useStyles();
    const [list, setList] = useState([]);
    const [customer, setCustomer] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [sendDate, setSendDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [paid, setPaid] = useState(false);
    const [ongkir, setOngkir] = useState(0)
    const [loading, setLoading] = useState(false);

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
        getPricelist()
        .then((res) => {
            if (res.data.status === 'ok') {
                for (let i = 0; i < res.data.list.length; i++) {
                    let product = res.data.list[i];
                    product.strPrice = formatCurrency(product.price);
                    product.desc = ""
                }
                setList(res.data.list);
            }
            else alert(res.data.msg);
        })
        .catch(err => alert(err));
    }, []);

    const handleDateChange = (date) => {
        console.log(date);
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

    const onSave = (customer, address, contact, paid, ongkir, sendDate) => {
        setLoading(true);
        const bracket =  _.filter(list, o => o.qty > 0);
        addOrder(customer, address, contact, bracket, paid, ongkir, sendDate, list)
        .then((res) => {
            if (res.data.status === 'ok') {
                setLoading(false);
                alert(res.data.msg);
                window.location.href = '/#/rekap'
            }
            else alert(res.data.msg); setLoading(false);
        })
        .catch(() => alert('Coba ulangi kembali'))
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

    const options = {
        filter: false,
        responsive: 'standard', 
        print: false,
        download: false, 
        jumpToPage: true,
        viewColumns: false,
        selectableRows: 'none'
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
                
            <Card className = {classes.myCard}>
                <CardContent>
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="flex-start"
                        style = {{marginLeft: '20px'}}
                    >
                        <h2>Tambah Orderan</h2>
                        <Grid container item alignItems = 'center'>
                            <Grid item sm = {2} xs = {12} >
                                Customer
                            </Grid>
                            <Grid item sm = {10} xs = {12}>
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
                            <Grid item sm = {2} xs = {12} >
                                Contact
                            </Grid>
                            <Grid item sm = {10} xs = {12}>
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
                            <Grid item sm = {2} xs = {12} >
                                Alamat
                            </Grid>
                            <Grid item sm = {10} xs = {12}>
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
                            <Grid item sm = {2} xs = {12} >
                                Ongkir
                            </Grid>
                            <Grid item sm = {10} xs = {12}>
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
                            <Grid item sm = {2} xs = {12} >
                                Tanggal Pengiriman
                            </Grid>
                            <Grid item sm = {10} xs = {12}>
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
                        <MUIDataTable 
                            title = "List Produk"
                            data = {list}
                            columns = {columns}
                            options = {options}
                        />
                        <div style = {{marginTop: '10px', marginRight: '25px', display: 'block'}}>
                            <Button
                                variant = "contained"
                                onClick = {() => onSave(customer, address, contact,paid, ongkir, sendDate)}
                                color = "secondary"
                                style = {{marginTop: "20px"}}
                            >
                                Tambah
                            </Button>
                        </div>
                    </Grid>
                </CardContent>
            </Card>
            <Loading open = {loading} />
        </>
    )
}