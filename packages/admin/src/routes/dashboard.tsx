import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import groupBy from 'lodash.groupby';
import { useQuery } from 'react-query';
import useHourCallback from '../hooks/use_hour_callback';
import styled from '../components/styled';
import { useTheme } from '@material-ui/core/styles';
import { getOngoingOrders, getTodaysOrders, Order } from '../api/orders';
import OrdersCards from '../components/orders_cards';

function parseHour(date: string) {
  const dateObject = parseISO(date);

  return format(dateObject, "HH':00'");
}

const OrdersDiv = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row',
  marginBottom: theme.spacing(3),
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

export default function Dashboard() {
  const [ordersData, setOrdersData] = React.useState([]);
  const [ongoingOrders, setOngoingOrders] = React.useState({});

  const { data: todaysOrders, refetch } = useQuery('todays_orders', getTodaysOrders, {
    onSuccess: ({ rows }) => {
      const ordersGrouped = groupBy(rows, (item: Order) => parseHour(item.createdAt));

      const data = Object.keys(ordersGrouped).map((v) => {
        const { length } = ordersGrouped[v];

        return {
          name: v,
          value: length,
        };
      });

      setOrdersData(data);
    }
  });

  useQuery('ongoing_orders', getOngoingOrders, {
    onSuccess: (data) => {
      const ordersGrouped = groupBy(data, 'status');

      setOngoingOrders(ordersGrouped);
    },
  })

  const theme = useTheme();

  function getOrders() {
    refetch();
  }

  useHourCallback(getOrders);

  return (
    <>
      <Typography variant="h3" component="h2" gutterBottom>
        Bem vindo!
      </Typography>
      {todaysOrders?.count > 0 && (
        <OrdersDiv>
          <NumberOrders>
            <Typography
              variant="h2"
              component="span"
              style={{ color: theme.palette.primary.main }}
            >
              {todaysOrders?.count}
            </Typography>
            <Typography>
              {todaysOrders?.count > 1 ? 'Pedidos realizados' : 'Pedido realizado'} hoje.
            </Typography>
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
                <Bar dataKey="value" fill={theme.palette.secondary.main} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartDiv>
        </OrdersDiv>
      )}
      <OrdersCards data={ongoingOrders} />
    </>
  );
}
