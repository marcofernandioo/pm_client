import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';


import {getDailySales} from '../api';
import Loading from './Loading';

import {Bar, Doughnut, Line} from '@reactchartjs/react-chart.js';




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
    },
    chartTitle: {
        margin: 'auto',
        textAlign: 'center',
    },
    groupedBarChart: {
        width: '50%',
        height: '800px',
        display: 'block'
    }
}))

export default function Sales () {
    const [startDateValue, setStartDateValue] = useState(new Date().toISOString().split('T')[0]);
    const [endDateValue, setEndDateValue] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const [dates, setDates] = useState();
    const [revenues, setRevenues] = useState();
    const [profits, setProfits] = useState();

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
                setDates(res.data.salesData.date);
                setRevenues(res.data.salesData.revenue);
                setProfits(res.data.salesData.profit);
                setLoading(false);
            } else {
                alert('Error, ulangi kembali');
            }
        })
        .catch(() => alert('Error, coba ulangi kembali'))
    }

    useEffect(() => {
        getDailySales(startDateValue,endDateValue)
        .then((res) => {
            if (res.data.status == 'ok') {
                setDates(res.data.salesData.date);
                setRevenues(res.data.salesData.revenue);
                setProfits(res.data.salesData.profit);
                setLoading(false);
            } else {
                alert('Error, ulangi kembali');
            }
        })
        .catch(() => alert('Error, coba ulangi kembali'))
    }, []);

    const barData = {
        labels: dates,
        datasets: [
            {
                label: 'Laba Kotor',
                data: revenues,
                backgroundColor: 'rgb(255, 99, 132)'
            },
            {
                label: 'Laba Bersih',
                data: profits,
                backgroundColor: 'rgb(54, 162, 235)'
            }
        ],
    }

    // const donutData = {
    //     labels: ['Alpukat', 'Mangga', 'Pisang', 'Jeruk', 'Anggur', 'Semangka'],
    //     datasets: [
    //       {
    //         label: '# of Votes',
    //         data: [12, 19, 3, 5, 2, 3],
    //         backgroundColor: [
    //           'rgba(255, 99, 132, 0.8)',
    //           'rgba(54, 162, 235, 0.8)',
    //           'rgba(255, 206, 86, 0.8)',
    //           'rgba(75, 192, 192, 0.8)',
    //           'rgba(153, 102, 255, 0.8)',
    //           'rgba(255, 159, 64, 0.8)',
    //         ],
    //         borderWidth: 1,
    //       },
    //     ],
    // }

    // const lineData = {
    //     labels: ['16-02-2021', '17-02-2021', '21-02-2021', '22-02-2021', '23-02-2021', '15-03-2021'],
    //     datasets: [
    //         {
    //         label: '# Penjualan',
    //         data: [3, 4, 10, 15, 5, 6],
    //         fill: false,
    //         backgroundColor: 'rgb(255, 99, 132)',
    //         borderColor: 'rgba(255, 99, 132, 0.5)',
    //         },
    //     ],
    // }

    const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        // maintainAspectRatio: false,
    }

    return (
        <>
            <Card xs = {12}>
                <CardContent>
                    <Grid>
                        <h2>Data Sales Harian</h2>
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
                    <br></br>
                    <Grid
                        container
                        direction = 'row'
                        justify = 'center'
                        alignItems = 'center'
                    >
                        {
                            dates &&
                            <>
                                <Grid item xs = {12} lg = {6}>
                                    {/* <div className = {classes.groupedBarChart}> */}
                                        <div className = {classes.chartTitle} ><h2>Laba Kotor & Laba bersih</h2></div>
                                        <Bar data={barData} options={options}/> 
                                    {/* </div> */}
                                </Grid>
                            </>
                        }
                        
                    </Grid>
                    
                </CardContent>
            </Card>
            
            
            <Loading open = {loading} />
            
        </>
    )
}