import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { navigate } from 'gatsby';

import { useAuthContext } from '../contexts/auth_context';
import AdminLayout from './admin_layout';

interface PrivateRouteInterface extends RouteComponentProps {
  component: React.ElementType;
  title: string;
}

type PrivateRouteProps = PrivateRouteInterface;

export default function PrivateRoute(
  { component: Component, title, ...other }: PrivateRouteProps,
) {
  const { isLogged } = useAuthContext();

  if (!isLogged) {
    navigate('/admin/login');
    return null;
  }

  return (
    <AdminLayout title={title}>
      <Component {...other} />
    </AdminLayout>
  );
}