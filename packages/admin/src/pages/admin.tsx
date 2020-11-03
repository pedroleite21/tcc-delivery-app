import * as React from 'react';
import { Router } from '@reach/router';
import SignIn from '../routes/sign_in';
import PrivateRoute from '../components/private_route';
import Dashboard from '../routes/dashboard';
import Menu from '../routes/menu';
import Product from '../routes/product';
import Orders from '../routes/orders';
import Moderator from '../routes/add_moderator';
import Settings from '../routes/settings';

export default function Admin() {
  return (
    <Router basepath="/admin">
      <PrivateRoute path="/home" title="Dashboard" component={Dashboard} />
      <PrivateRoute path="/menu" title="Cardápio" component={Menu} />
      <PrivateRoute path="/orders" component={Orders} title="Pedidos" />
      <PrivateRoute path="/product" component={Product} title="Adicionar Produto" />
      <PrivateRoute path="/product/:productId" component={Product} title="Editar Produto" />
      <PrivateRoute path="/moderators" component={Moderator} title="Moderadores" />
      <PrivateRoute path="/settings" component={Settings} title="Configurações" />
      <SignIn path="/login" />
    </Router>
  );
}