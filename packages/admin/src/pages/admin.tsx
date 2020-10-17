import * as React from 'react';
import { Router } from '@reach/router';
import SignIn from '../routes/sign_in';
import PrivateRoute from '../components/private_route';
import Dashboard from '../routes/dashboard';

export default function Admin() {
  return (
    <Router basepath="/admin">
      <PrivateRoute path="/home" title="Dashboard" component={Dashboard} />
      <SignIn path="/login" />
    </Router>
  );
}