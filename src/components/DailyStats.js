import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';


import {getDailySales} from '../api';
import Loading from './Loading';

import {Bar} from '@reactchartjs/react-chart.js';



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
    date: {
        marginLeft: theme.spacing(1), 
        marginRight: theme.spacing(1), 
        width: 200,
    }
}))

export default function DailyStats () {
    const [startDateValue, setStartDateValue] = useState(new Date().toISOString().split('T')[0]);
    const [endDateValue, setEndDateValue] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const [salesdata, setSalesdata] = useState([]);

    const classes = useStyles();

    const onChangeStartDate = (e) => {
        setStartDateValue(e.target.value);
    }
  
    const onChangeEndDate = (e) => {
        setEndDateValue(e.target.value);
    }

    const getDailySalesAction = (start,end) => {
        setLoading(true);
        getDailySales(start,end)
        .then((res) => {
            if (res.data.status == 'ok') {
                setSalesdata(res.data.salesData);
                console.log(res.data.salesData);
                setLoading(false);
            } else {
                alert('Error, ulangi kembali');
            }
        })
        .catch(() => alert('Error, coba ulangi kembali'))
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Grid>
                        <h3>Harian</h3>
                        <div className = {classes.rowContainer} >
                            <div className = {classes.columnName}>Tanggal Awal</div>
                            <div className = {classes.columnData}>
                                <form className={classes.container} noValidate>
                                    <TextField
                                        id="date"
                                        label="Dari"
                                        type="date"
                                        defaultValue={startDateValue}
                                        className={classes.textField}
                                        onChange={(e) => onChangeStartDate(e)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </form>
                            </div>
                        </div>
                        <div className = {classes.rowContainer} >
                            <div className = {classes.columnName}>Tanggal Akhir</div>
                            <div className = {classes.columnData}>
                            <form className={classes.container} noValidate>
                                <TextField
                                    id="date"
                                    label="Sampai"
                                    type="date"
                                    value={endDateValue}
                                    className={classes.textField}
                                    onChange={(e) => onChangeEndDate(e)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </form>
                            </div>
                        </div>
                        <div className = {classes.rowContainer} >
                            <Button
                                variant = "contained"
                                onClick = {() => getDailySalesAction(startDateValue,endDateValue)}
                                color = "primary"
                            >
                                cari
                            </Button>
                        </div>
                    </Grid>
                </CardContent>
            </Card>
            <Loading open = {loading} />
            
        </>
    )
}