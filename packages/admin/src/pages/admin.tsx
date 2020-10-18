import * as React from 'react';
import { Router } from '@reach/router';
import SignIn from '../routes/sign_in';
import PrivateRoute from '../components/private_route';
import Dashboard from '../routes/dashboard';
import Menu from '../routes/menu';
import Product from '../routes/product';

export default function Admin() {
  return (
    <Router basepath="/admin">
      <PrivateRoute path="/home" title="Dashboard" component={Dashboard} />
      <PrivateRoute path="/menu" title="Cardápio" component={Menu} />
      <PrivateRoute path="/product" component={Product} title="Adicionar Produto" />
      <PrivateRoute path="/product/:productId" component={Product} title="Editar Produto" />
      <SignIn path="/login" />
    </Router>
  );
}