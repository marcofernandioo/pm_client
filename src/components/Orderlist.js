import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import useSWR from 'swr'

import Loading from './Loading';
import {getDateOrders, deleteOrder, all, getDateRange, rangeSales} from '../api';



const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
});

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

const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'IDR'});

function format(num) {
  let res = formatter.format(num).split('IDR');
  res = res.slice(1);
  return `Rp.${res}`
}


function Row (props) {
    const {row} = props;
    const classes = useRowStyles();
    const [open, setOpen] = useState(false);
    
    
    const subtotal = calculateSubtotal(row);
    function calculateSubtotal(row) {
      let total = 0;
      for (let i = 0; i < row.basket.length; i++) {
        total += row.basket[i].total;
      }
      return total;
    }

    const totalBayar = getTotalBayar(row);
    function getTotalBayar(row) {
      return row.ongkir + subtotal;
    }

    const handleDeleteClick = (id) => {
      props.id(id)
      props.confirm(true);
    }

    const handleEditClick = (id) => {
      window.location.href = '/#/edit/'+id;
    }

    const change  = (paid) => {
      if (paid) return 'Sudah';
      else return 'Belum'
    }
    
    return (
        <>
          <TableRow className = {classes.root}>
            <TableCell>
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell align="left">{row.sendDateString}</TableCell>
            <TableCell component="th" scope="row">{row.buyer}</TableCell>
            <TableCell align="left">{row.contact}</TableCell>
            <TableCell align="left">{row.address}</TableCell>
            <TableCell align="left">{format(row.totalCost)}</TableCell>
            <TableCell align="left">{format(row.total)}</TableCell>
            <TableCell align="left">{change(row.paid)}</TableCell>
            <TableCell align="left">
              <div>
                <Tooltip title = "Ubah Orderan">
                  <IconButton> <EditIcon onClick = {() => handleEditClick(row._id)}/></IconButton>
                </Tooltip>
                <Tooltip title = "Hapus Ordran">
                  <IconButton> <DeleteIcon onClick = {() => handleDeleteClick(row._id)}/></IconButton>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>

                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Pembelian
                            </Typography>
                            <TableContainer component={Paper}>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                  {/* Small Table's Head */}
                                    <TableRow>
                                        <TableCell>Produk</TableCell>
                                        <TableCell>Jumlah</TableCell>
                                        <TableCell>Keterangan </TableCell>
                                        <TableCell>Total (Rp.)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Small Table' Data*/}
                                    {
                                      row.basket.map(product => (
                                        <>
                                          <TableRow>
                                            <TableCell component = "th" scope = "row">{product.name}</TableCell>
                                            <TableCell>{product.qty}</TableCell>
                                            <TableCell >{product.desc}</TableCell>
                                            <TableCell>{format(product.total)}</TableCell>
                                          </TableRow>
                                        </>
                                      ))
                                    }
                                    <TableRow>
                                        <TableCell rowSpan = {3}/>
                                        <TableCell rowSpan = {3}/>
                                        <TableCell colSpan = {1}>Subtotal</TableCell>
                                        <TableCell align = "right" >{format(subtotal)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Ongkir</TableCell>
                                        <TableCell align = "right">{format(row.ongkir)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Total Pembayaran</TableCell>
                                        <TableCell align = "right">{format(totalBayar)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            </TableContainer>
                            </Box>
                        </Collapse>
                    </TableCell>
                    
                </TableRow>
        </>
    )
}

Row.propTypes = {
  row: PropTypes.shape({
    basket: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        qty: PropTypes.number, 
        desc: PropTypes.string,
        total: PropTypes.number,
      })
    )
  })
}


// const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Orderlist() {
    const [orderData, setOrderData] = useState([]);
    const [confirm, setConfirm] = useState(false);
    const [idValue, setIdValue] = useState('');
    const [startDateValue, setStartDateValue] = useState(new Date().toISOString().split('T')[0]);
    const [endDateValue, setEndDateValue] = useState(new Date().toISOString().split('T')[0]);
    
    const [loading, setLoading] = useState(false);

    const [revenue, setRevenue] = useState(null);
    const [cost, setCost] = useState(null);
    const [profit, setProfit] = useState(null);

    // const URL = 'https://pasar-medan.herokuapp.com/order/all';
    // const {orders, err} = useSWR(URL, fetcher);

    // if (!orders) console.log("fucky orders");
    // if (err) console.log("also fucky")
    // console.log("orders cache: ", orders);
    

    const classes = useStyles();

    const handleCloseDialog = () => {
      setConfirm(false);
    }

    const onChangeStartDate = (e) => {
      setStartDateValue(e.target.value);
    }

    const onChangeEndDate = (e) => {
      setEndDateValue(e.target.value);
    }

    const onDeleteOrder = (id) => {
      deleteOrder(id)
      .then((res) => {
        if (res.data.status === 'ok') {
          alert(res.data.msg);
          window.location.href = '/';
        }
        else alert(res.data.msg); setLoading(false);
      })
      .catch((err) => alert(err));
    }

    const getSalesData = (start,end) => {
      rangeSales(start,end)
      .then((res) => {
        if (res.data.status === 'ok') {
          setRevenue(res.data.msg.revenue)
          setCost(res.data.msg.cost)
          setProfit(res.data.msg.profit)
        }
        else alert('err'); 
      })
      .catch(err => alert(err));
    }

    const searchOrders = (startdate,enddate) => {
      setLoading(true)
      getDateRange(startdate,enddate)
      .then((res) => {
        if (res.data.status === 'ok') {
          setOrderData(res.data.msg);
          setLoading(false);
        }
        else alert(res); setLoading(false);
      })
      .catch(err => alert(err));
      getSalesData(startdate,enddate);
    }

    return (
      <>
        <h2>Detail Orderan: Pendapatan, Modal, Untung.</h2>
        
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
            onClick = {() => searchOrders(startDateValue,endDateValue)}
            color = "primary"
          >
            cari
          </Button>
        </div>
        
        <br/>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align = "left">Tgl.</TableCell>
                <TableCell align = "left">Customer</TableCell>
                <TableCell align = "left">Contact</TableCell>
                <TableCell align = "left">Alamat</TableCell>
                <TableCell align = "left">Modal</TableCell>
                <TableCell align = "left">Total</TableCell>
                <TableCell align = "left">Bayar</TableCell>
                <TableCell align = "left"> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                orderData.map(row => (
                  <Row row = {row} id = {idValue => setIdValue(idValue)} confirm = {conf => setConfirm(conf)}/>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <h2>Pendapatan: {format(revenue)}</h2>
        <h2>Modal: {format(cost)}</h2>
        <h2>Untung: {format(profit)}</h2>
        <Dialog
          open={confirm}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Hapus Orderan Ini?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Order yang dihapus tidak dapat dibalikkan kembali.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirm(false)} color="primary">
              Kembali
            </Button>
            <Button onClick={() => onDeleteOrder(idValue)} color="primary" autoFocus>
              Hapus
            </Button>
          </DialogActions>   
        </Dialog>
        <Loading open = {loading} />
      </>
    );
}