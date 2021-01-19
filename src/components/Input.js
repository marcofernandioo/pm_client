import React, {useState, useEffect} from 'react';
import 'date-fns';
import MaterialTable from 'material-table';
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

import {getPricelist} from '../api';

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
    const [pricelist, setPricelist] = useState([]);
    const [customer, setCustomer] = useState('');
    const [addresss, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [orderDate, setOrderDate] = useState(new Date);
    const [sendDate, setSendDate] = useState(new Date);
    const [basket, setBasket] = useState([]);

    const columns = [
        {
            title: 'Produk',
            field: 'name',
            editable: 'never'
        }, 
        {
            title: 'Qty',
            field: 'qty',
            // type: 'numeric'
        }, 
        {
            title: 'Harga',
            field: 'price', 
            editable: 'never', 
        }, 
        {
            title: 'Jumlah',
            field: 'total',
            editable: 'never'
        }
    ]

    useEffect(() => {
        getPricelist()
        .then((res) => {
            if (res.data.status == 'ok') {
                setPricelist(res.data.list);
                console.log(pricelist);
            } else console.log(res.data.msg)
        })
        .catch(err => console.log(err));
    }, []);

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
                                        onChange={(e) => setSendDate(e)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                            </div>
                        </div>
                        

                    
                <MaterialTable 
                    title = "List Buah"
                    columns = {columns}
                    data = {pricelist}
                    cellEditable={{
                        onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                        return new Promise((resolve, reject) => {
                            console.log('newValue: ' + newValue);
                                    // setData({...data})
                            setTimeout(resolve, 100);
                        });
                        }
                    }}
                />
                        <Button
                            variant = "contained"
                            // onClick = {onSubmitTask}
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