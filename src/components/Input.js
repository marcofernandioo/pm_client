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

import _ from 'lodash';

import {getPricelist, addOrder} from '../api';

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

export default function Input () {
    const classes = useStyles();
    // const [pricelist, setPricelist] = useState([]);
    const [list, setList] = useState([]);
    const [customer, setCustomer] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [sendDate, setSendDate] = useState(new Date);
    const [sendTime, setSendTime] =  useState('');
    const [basket, setBasket] = useState(['uwu']);
    const [openDialog, setOpenDialog] = useState(false);


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
        
        // {
        //     name: 'total', 
        //     label: 'Total', 
        //     options: {
        //         customBodyRender: (value, meta, table) => {
        //             return (
        //                 <TextField 
        //                     value = {value}
        //                     defaultValue = ""
        //                     variant = "outlined"
        //                     type = "number"
        //                     // onChange = {(e) => onUpdateDesc(meta.rowIndex, e.target.value)}
        //                 />
        //             )
        //         }
        //     }
        // }
        
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

    const onSave = (customer, address, contact) => {
        const bracket =  _.filter(list, o => o.qty > 0);
        // setBasket(bracket);
        // console.log(bracket);
        addOrder(customer, address, contact, bracket)
        .then((res) => {
            if (res.data.status == 'ok') {
                window.location.href = '/'
            }
            else console.log('BIG NOO');
        })
        .catch((err) => alert(err))
    }

    return (
        <> 
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
                                    onChange = {(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Tanggal Pengiriman</div>
                            <div className = {classes.columnData}> 
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
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
                                </Grid>
                            </MuiPickersUtilsProvider>
                            </div>
                        </div>
                        <div className = {classes.rowContainer}>
                            <div className = {classes.columnName}>Jam Pengiriman</div>
                            <div className = {classes.columnData}> 
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
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
                                </Grid>
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
                            onClick = {() => onSave(customer, address, contact)}
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