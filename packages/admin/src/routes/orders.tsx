import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { usePaginatedQuery } from 'react-query';
import { getOrders } from '../api/orders';
import styled from '../components/styled';
import { RenderItems } from '../components/orders_cards';

const orderStatus = {
  awaiting_confirmation: 'Pedido aguardando confirmação',
  cancelled: 'Pedido cancelado',
  confirmed: 'Pedido confirmado',
  delivered: 'Pedido entregue',
  on_route: 'Pedido em rota de entrega',
};

const FilterDiv = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingBottom: theme.spacing(2),

  '> div': {
    width: 250,
  },
}));

export default function Orders() {
  const [query, setQuery] = React.useState({
    page: 0,
    size: 5,
    status: null,
  });
  const { resolvedData, latestData } = usePaginatedQuery(['orders', query], getOrders);

  const handleChangePage = (event: unknown, newPage: number) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery((prev) => ({
      ...prev,
      size: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  const handleChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery((prev) => ({
      ...prev,
      status: value === 'clean' ? null : value,
    }));
  };

  return (
    <>
      <FilterDiv>
        <TextField
          id="filter-status"
          select
          label="Filtre o status do pedido"
          value={query.status}
          variant="outlined"
          onChange={handleChangeFilter}
        >
          <MenuItem value="clean">
            Limpar
          </MenuItem>
          {Object.keys(orderStatus).map((option) => (
            <MenuItem key={option} value={option}>
              {orderStatus[option]}
            </MenuItem>
          ))}
        </TextField>
      </FilterDiv>
      <Paper>
        <TableContainer>
          <Table aria-label="Pedidos">
            <TableHead>
              <TableRow>
                <TableCell width="100px">Pedido #</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Resumo</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resolvedData?.orders.map(({ id, status, customer, items }) => (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">{id}</TableCell>
                  <TableCell>{customer?.name}</TableCell>
                  <TableCell><RenderItems items={items} /></TableCell>
                  <TableCell>{orderStatus[status]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={latestData?.totalItems}
          labelRowsPerPage="Pedidos por página:"
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          page={query.page}
          rowsPerPage={query.size}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </>
  );
}