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

import {getBaskets, getOrderData} from '../api';


const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
});

function createData(customer, address, contact, sendDate, total) {
    return {
      customer,
      address,
      contact,
      sendDate,
      total,
      keranjang: [
        {products: 'mannga1', qty: 69, total: 10000, desc: 'pahit'},
        {products: 'mannga2', qty: 69, total: 10000, desc: 'pahit'}, 
        {products: 'mannga3', qty: 69, total: 10000, desc: 'pahit'}
      ],
    };
}

const rows = [
    createData('Aphing', "jl bintang", "08123", "nope", 10000),
    createData('Aling', "jl bintang", "08123", "nope", 10000),
    createData('Aciao', "jl bintang", "08123", "nope", 10000),
    createData('Abe', "jl bintang", "08123", "nope", 10000),
    createData('Auwu', "jl bintang", "08123", "nope", 10000),
  ];


// The data queried from the API.
// const data = [
//     {buyer, adr, ctc, sD, basket, total}, 
//     {buyer, adr, ctc, sD, basket, total}, 
// ]

// const baskets = [
//     [ //Basket of a person

//     ], 
//     [ // Basket of another person

//     ],// etc.. until all of the baskets of a single day.
// ]



function Row (props) {
    const {row} = props;
    const classes = useRowStyles();
    const [open, setOpen] = useState(false);
    

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
                    <TableCell align="right">{row.address}</TableCell>
                    <TableCell align="right">{row.contact}</TableCell>
                    <TableCell align="right">{row.total}</TableCell>
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
                                    <TableRow>
                                        <TableCell>Produk</TableCell>
                                        <TableCell>Jumlah</TableCell>
                                        <TableCell>Keterangan </TableCell>
                                        <TableCell align="right">Total (Rp.)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                      row.basket.map(product => (
                                        <TableRow>
                                          <TableCell component = "th" scope = "row">{product.name}</TableCell>
                                          <TableCell>{product.qty}</TableCell>
                                          <TableCell >{product.desc}</TableCell>
                                          <TableCell align = "right">{product.total}</TableCell>

                                        </TableRow>
                                      ))
                                    }
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
    const [baskets, setBaskets] = useState([]);


    useEffect(() => {
      getOrderData()
      .then(res => {
        // setOrderData(res.data.msg)
        if (res.data.status == 'ok') {setOrderData(res.data.msg); console.log('uwu')}
        else console.log(res.data.msg);
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
                <TableCell align = "right">Alamat</TableCell>
                <TableCell align = "right">Contact</TableCell>
                <TableCell align = "right">Tanggal Pengiriman</TableCell>
                <TableCell align = "right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {
                orderData.map((row) => (
                    <Row row = {row}>
                ))  
              } */}
              {
                orderData.map(row => (
                  <Row row = {row} />
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant = "outlined" onClick = {() => console.log(orderData)}> Fuck me!</Button>
      </>
    );
}