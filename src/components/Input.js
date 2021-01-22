import React, {useState, useEffect} from 'react';
import 'date-fns';
// import MaterialTable from 'material-table';
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
  KeyboardTimePicker
} from '@material-ui/pickers';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Checkbox from '@material-ui/core/Checkbox';

import _ from 'lodash';

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
    const [sendDate, setSendDate] = useState(new Date);
    const [open, setOpen] = useState(false);
    const [paid, setPaid] = useState(false);


    const columns = [
        {
            name: 'name',
            label: 'Produk'
        }, 
        {
            name: 'qty',
            label: 'Quantity',
            options: {
                customBodyRender: (value, meta, table) => {
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
            name: 'price',
            label: 'Harga',
        }, 
        {
            name: 'desc', 
            label: 'Keterangan', 
            options: {
                customBodyRender: (value, meta, table) => {
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
            if (res.data.status == 'ok') {
                for (let i = 0; i < res.data.list.length; i++) {
                    let product = res.data.list[i];
                    product.desc = ""
                }
                setList(res.data.list);
            }
            else console.log(res.data.msg)
        })
        .catch(err => console.log(err));
    }, []);

    const handleDateChange = (date) => {
        setSendDate(date)
    }

    const onUpdateQty = (rowIndex, qty) => {
        let updateProducts = [ ...list ];
        let price = updateProducts[rowIndex].total;
        updateProducts[rowIndex].qty = qty;
        updateProducts[rowIndex].total = qty * price;
        // console.log(updateProducts[rowIndex]);
        setList(updateProducts);
    }

    const onUpdateDesc = (rowIndex, text) => {
        let updateProducts = [ ...list ];
        updateProducts[rowIndex].desc = text;
        setList(updateProducts);
    }

    const onSave = (customer, address, contact, paid) => {
        const bracket =  _.filter(list, o => o.qty > 0);
        addOrder(customer, address, contact, bracket, paid)
        .then((res) => {
            if (res.data.status == 'ok') setOpen(true);
            else alert(res.data.msg);
        })

        .catch((err) => alert('Coba ulangi kembali'))
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
                    <Grid>
                        <h2>Tambah Orderan</h2>
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Nama Customer</div>
                            <div className = {classes.columnData}> 
                                <TextField 
                                    type = "text" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    value = {customer}
                                    onChange = {(e) => setCustomer(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Contact</div>
                            <div className = {classes.columnData}> 
                                <TextField 
                                    type = "text" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    value = {contact}
                                    onChange = {(e) => setContact(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Alamat</div>
                            <div className = {classes.columnData}> 
                                <TextField 
                                    type = "text" 
                                    variant = "outlined" 
                                    fullWidth 
                                    className = {classes.textField} 
                                    value = {address}
                                    onChange = {(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Tanggal Pengiriman</div>
                            <div className = {classes.columnData}> 
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                {/* <Grid container justify="space-around"> */}
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="dd/MM/yyyy"
                                        margin="normal"
                                        value={sendDate}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                {/* </Grid> */}
                            </MuiPickersUtilsProvider>
                            </div>
                        </div>
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Jam Pengiriman</div>
                            <div className = {classes.columnData}> 
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                {/* <Grid container justify="space-around"> */}
                                <TextField
                                    id="time"
                                    type="time"
                                    defaultValue= {sendDate}
                                    format = "HH:mm"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300, // 5 min
                                    }}
                                    onChange = {handleDateChange}
                                />
                                {/* </Grid> */}
                            </MuiPickersUtilsProvider>
                            </div>
                        </div>
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Sudah dibayar</div>
                            <div className = {classes.columnData}> 
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                {/* <Grid container justify="space-around"> */}
                                    <Checkbox
                                        checked={paid}
                                        onChange={handleChecks}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                {/* </Grid> */}
                            </MuiPickersUtilsProvider>
                            </div>
                        </div>
                        <MUIDataTable 
                            title = "List Produk"
                            data = {list}
                            columns = {columns}
                            // options = {options}
                        />

                        <Button
                            variant = "contained"
                            // onClick = {onSubmitTask}
                            onClick = {() => onSave(customer, address, contact,paid)}
                            color = "secondary"
                            style = {{marginTop: "20px"}}
                        >
                            Tambah
                        </Button>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}