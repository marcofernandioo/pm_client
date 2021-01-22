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

import {getOrderData} from '../api';


const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
});

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

    return (
        <>
            <React.Fragment>

                <TableRow className = {classes.root}>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">{row.buyer}</TableCell>
                    <TableCell align="left">{row.address}</TableCell>
                    <TableCell align="left">{row.contact}</TableCell>
                    <TableCell align="left">{format(row.total)}</TableCell>
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
                                        <TableCell align = "center" >{format(subtotal)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Ongkir</TableCell>
                                        <TableCell align = "center">{format(row.ongkir)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Total Pembayaran</TableCell>
                                        <TableCell align = "center">{format(totalBayar)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            </TableContainer>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
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

export default function Orderlist() {
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
      getOrderData()
      .then(res => {
        if (res.data.status == 'ok') setOrderData(res.data.msg); 
        else alert(res.data.msg);
      })
      .catch(err => alert(err));
    }, [])

    return (
      <>
        <h2>Orderlist</h2>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Customer</TableCell>
                <TableCell align = "left">Alamat</TableCell>
                <TableCell align = "left">Contact</TableCell>
                <TableCell align = "left">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                orderData.map(row => (
                  <Row row = {row} />
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
}