import * as React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useMutation, useQueryCache } from 'react-query';
import styled from './styled';
import { updateOrderStatus } from '../api/orders';

const orderStatus = [
  {
    value: 'awaiting_confirmation',
    label: 'Pedidos aguardando confirmação',
  },
  {
    value: 'confirmed',
    label: 'Pedidos em preparação',
  },
  {
    value: 'on_route',
    label: 'Pedidos em rota',
  }
];

const CardsDiv = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  margin: `${theme.spacing(2)}px 0`,
  gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))',
}));

const InfoView = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

function RenderItems({ items }) {
  return (
    <div
      // @ts-ignore 
      css={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: 8,

        '> div': {
          alignItems: 'flex-start',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'row',
          marginBottom: 8,
          paddingBottom: 8,

          '> span': {
            backgroundColor: '#000',
            borderRadius: 4,
            color: '#fff',
            marginRight: 8,
            padding: 4,
          },

          '> div': {
            display: 'flex',
            flexDirection: 'column',

            '> span:first-of-type': {
              marginBottom: 4,
              fontWeight: 'bold',
            },
          },
        },
      }}
    >
      {items.map(({ id, name, order_item: { quantity }, options = [] }) => (
        <div key={id}>
          <span>{quantity}</span>
          <div>
            <span>{name}</span>
            {options.map(({ optionId, name, quantity }) => (
              <span key={optionId}>• {quantity} {name}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersCards({ data }) {
  const cache = useQueryCache();

  const [updateStatus] = useMutation(updateOrderStatus, {
    onSuccess: () => {
      cache.invalidateQueries('ongoing_orders');
    }
  });

  const handleClick = async (status: string, id: number | string) => {
    await updateStatus({ status, id });
  };

  const actions = {
    awaiting_confirmation: (id) => (
      <>
        <Button size="small" color="secondary" onClick={() => handleClick('cancelled', id)}>
          Cancelar pedido
        </Button>
        <Button size="small" color="primary" variant="contained" onClick={() => handleClick('confirmed', id)}>
          Confirmar pedido
        </Button>
      </>
    ),
    confirmed: (id) => (
      <Button size="small" color="primary" variant="contained" onClick={() => handleClick('on_route', id)}>
        Saiu em rota de entrega
      </Button>
    ),
    on_route: (id) => (
      <Button size="small" color="primary" variant="contained" onClick={() => handleClick('delivered', id)}>
        Pedido entregue
      </Button>
    ),
  }

  return (
    <>
      {orderStatus.map(({ label, value }) => {
        const status = data[value];

        if (!status || Array.isArray(status) && status.length === 0) return null;

        return (
          <>
            <Typography component="h3" variant="h5">
              {label}
            </Typography>
            <CardsDiv>
              {status.map(({ id, takeout, value: orderValue, items, addresses, payments }) => {
                const address = addresses[0];
                const payment = payments[0];
                return (
                  <Card key={id}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="span">
                        {`Pedido #${id}`}
                      </Typography>
                      <Typography gutterBottom variant="body1" component="p">
                        {`Total: R$ ${orderValue}`}
                      </Typography>
                      <RenderItems items={items} />
                      <InfoView>
                        <Typography variant="body2" component="span" gutterBottom>
                          {takeout
                            ? <b>Retirada no resturante</b>
                            : (
                              <>
                                <b>Endereço: </b>
                                {address?.address_1}. {address?.address_2}. {address?.locality}
                              </>
                            )}
                        </Typography>
                        <Typography variant="body2" component="span">
                          <b>Pagamento: </b>
                          {payment?.name}. {payment?.id === 1 && `Troco para R$ ${payment?.order_payment?.change}`}
                        </Typography>
                      </InfoView>
                    </CardContent>
                    <CardActions>
                      {actions[value](id)}
                    </CardActions>
                  </Card>
                )
              })}
            </CardsDiv>
          </>
        );
      })}
    </>
  )
}

