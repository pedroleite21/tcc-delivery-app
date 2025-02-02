import * as React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/People';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { LinkMenuItem } from './user_profile';

const mainList = (
  <List component="nav">
    <LinkMenuItem to="/admin/home" css={{ marginBottom: 8 }}>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Início" />
    </LinkMenuItem>
    <Divider />
    <ListSubheader component="span">Gerenciar Loja</ListSubheader>
    <LinkMenuItem to="/admin/orders">
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Pedidos" />
    </LinkMenuItem>
    <LinkMenuItem to="/admin/menu">
      <ListItemIcon>
        <RestaurantMenuIcon />
      </ListItemIcon>
      <ListItemText primary="Cardápio" />
    </LinkMenuItem>
    <LinkMenuItem to="/admin/moderators" admin>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Moderadores" />
    </LinkMenuItem>
    <LinkMenuItem to="/admin/settings" admin>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Configurações" />
    </LinkMenuItem>
  </List>
);

export default mainList;
