import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import useHourCallback from '../components/use_hour_callback';
import styled from '../components/styled';
import { useTheme } from '@material-ui/core/styles';

const OrdersDiv = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row',
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
}));

const NumberOrders = styled.div(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  display: 'inline-flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  width: '30%',
}));

const ChartDiv = styled.div(({ theme }) => ({
  display: 'inline-flex',
  padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  width: '70%',
}));

const data = [
  {
    name: '09:00', value: 2,
  },
  {
    name: '10:00', value: 5,
  },
  {
    name: '11:00', value: 5,
  },
  {
    name: '12:00', value: 10,
  },
  {
    name: '13:00', value: 1,
  },
];

export default function Dashboard() {
  const [ordersData, setOrdersData] = React.useState(data);
  const theme = useTheme();

  function getOrders() {
    console.log('oi');
  }

  useHourCallback(getOrders);

  return (
    <>
      <OrdersDiv>
        <NumberOrders>
          <Typography
            variant="h2"
            style={{ color: theme.palette.primary.main }}
          >
            2
          </Typography>
          <Typography>Pedidos realizados hoje.</Typography>
        </NumberOrders>
        <ChartDiv>
          <ResponsiveContainer
            width="100%"
            height={200}
          >
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={theme.palette.secondary.main} />
            </BarChart>
          </ResponsiveContainer>
        </ChartDiv>
      </OrdersDiv>
      <Typography component="h2" variant="h5">
        Pedidos em andamento
      </Typography>
    </>
  );
}
