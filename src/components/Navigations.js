import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import {Switch, Route} from 'react-router-dom';

import MenuBookIcon from '@material-ui/icons/MenuBook';
import AddIcon from '@material-ui/icons/Add';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import ListAltIcon from '@material-ui/icons/ListAlt';
import EqualizerIcon from '@material-ui/icons/Equalizer';


import Input from './Input';
import Pricelist from './Pricelist';
import Sales from './Sales';
import Orderlist from './Orderlist';
import EditProduct from './EditProduct';
import AddProduct from './AddProduct';
import EditOrder from './EditOrder';
import OrderlistCustomer from './OrderlistCustomer';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Pasar Medan
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick = {() => window.location.href = '/#/pricelist'} >
              <ListItemIcon><MenuBookIcon/></ListItemIcon>
              <ListItemText primary = {"Pricelist Produk"} />
          </ListItem>
          <ListItem button onClick = {() => window.location.href = '/#/order'} >
              <ListItemIcon><AddIcon/></ListItemIcon>
              <ListItemText primary = {"Tambah Order"} />
          </ListItem>
          <ListItem button onClick = {() => window.location.href = '/#/rekap'} >
              <ListItemIcon><ListAltIcon/></ListItemIcon>
              <ListItemText primary = {"Rekapan Order"} />
          </ListItem>
          <ListItem button onClick = {() => window.location.href = '/'} >
              <ListItemIcon><FormatListBulletedIcon/></ListItemIcon>
              <ListItemText primary = {"Detail Orderan"} />
          </ListItem>
          <ListItem button onClick = {() => window.location.href = '/#/sales'} >
              <ListItemIcon><EqualizerIcon/></ListItemIcon>
              <ListItemText primary = {"Sales"} />
          </ListItem>
          
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
            <Route path = '/pricelist' component = {Pricelist} />
            <Route path = '/order' component = {Input} />
            <Route path = '/sales' component = {Sales} />
            <Route path = '/product/edit/:id' component = {EditProduct} />
            <Route path = '/edit/:id' component = {EditOrder} />
            <Route path = '/add' component = {AddProduct} />
            <Route path = '/rekap' component = {OrderlistCustomer} />
            <Route exact path = '/' component = {Orderlist} />
        </Switch>
      </main>
    </div>
  );
}
