import * as React from 'react';
import { Router } from '@reach/router';
import SignIn from '../routes/sign_in';
import PrivateRoute from '../components/private_route';
import Dashboard from '../routes/dashboard';
import Menu from '../routes/menu';

export default function Admin() {
  return (
    <Router basepath="/admin">
      <PrivateRoute path="/home" title="Dashboard" component={Dashboard} />
      <PrivateRoute path="/menu" title="Cardápio" component={Menu} />
      <SignIn path="/login" />
    </Router>
  );
}