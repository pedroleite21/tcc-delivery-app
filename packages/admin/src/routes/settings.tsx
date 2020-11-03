import * as React from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useForm } from 'react-hook-form';
import styled from '../components/styled';
import NumberTextField from '../components/number_text_field';
import { useMutation, useQuery } from 'react-query';
import { getRestaurantInfo, postRestaurantInfo } from '../api/admin';
import { useSnackbar } from 'notistack';

const SettingsHeader = styled.div(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}));

const StyledForm = styled.form(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: theme.spacing(1),
  maxWidth: 600,
  width: '100%',
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export default function Settings() {
  const [minOrder, setMinOrder] = React.useState('');
  const { register, errors, handleSubmit, setValue } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  useQuery('restaurant_info', getRestaurantInfo, {
    onSuccess: (data) => {
      if (Object.keys(data).length > 0) {
        setValue('name', data?.name);
        setMinOrder(data?.minimum_order);
        setValue('opensAt', data?.opensAt);
        setValue('closesAt', data?.closesAt);
        setValue('address.address_1', data?.address?.address_1);
        setValue('address.address_2', data?.address?.address_2);
        setValue('address.locality', data?.address?.locality);
      }
    },
  });

  const [postInfo] = useMutation(postRestaurantInfo, {
    onSuccess: () => {
      enqueueSnackbar('Informações inseridas com sucesso', { variant: 'success' });
    },
    onError: (res) => {
      // @ts-ignore
      enqueueSnackbar(res?.response?.data?.message || 'Ops... ocorreu algum erro', { variant: 'error' });
    },
  });

  const onSubmit = async (data) => {
    const newData = {
      ...data,
      'minimum_order': minOrder
    }

    await postInfo(newData);
  };

  return (
    <>
      <SettingsHeader>
        <Typography variant="h4" component="h2">
          Configurações do restaurante
        </Typography>
        <Button
          color="primary"
          form="settings-form"
          size="large"
          startIcon={<SaveIcon />}
          type="submit"
          variant="contained"
        >
          Salvar
        </Button>
      </SettingsHeader>
      <Divider />
      <StyledForm id="settings-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          id="name"
          label="Nome do restaurante"
          error={errors.name != undefined}
          helperText={errors?.name?.message}
          name="name"
          required
          margin="normal"
          variant="outlined"
          inputRef={register({
            required: 'Insira um nome válido',
          })}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Valor do pedido mínimo"
          margin="normal"
          name="minimum_order"
          id="min-order"
          variant="outlined"
          InputProps={{
            inputComponent: NumberTextField as any,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          value={minOrder}
          onChange={(e) => setMinOrder(e.target.value)}
        />
        <Typography variant="h6" component="span">
          Horário de funcionamento
        </Typography>
        <StyledGrid container spacing={2} alignItems="center">
          <Grid item xs={5}>
            <TextField
              id="opensAt"
              label="Abertura"
              name="opensAt"
              error={errors.opensAt != undefined}
              required
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              type="time"
              inputProps={{
                step: 1800,
              }}
              fullWidth
              inputRef={register({
                required: true,
              })}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography style={{ textAlign: 'center' }} variant="button" component="span">
              Até às
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              id="closesAt"
              label="Fechamento"
              name="closesAt"
              error={errors.closesAt != undefined}
              required
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              type="time"
              inputProps={{
                step: 1800,
              }}
              fullWidth
              inputRef={register({
                required: true,
              })}
            />
          </Grid>
        </StyledGrid>
        <Typography variant="h6" component="span">
          Endereço do restaurante
        </Typography>
        <TextField
          id="address_1"
          label="Endereço"
          margin="normal"
          name="address.address_1"
          error={errors?.address?.address_1 != undefined}
          required
          variant="outlined"
          inputRef={register({
            required: true,
          })}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="address_2"
          label="Complemento do endereço"
          margin="normal"
          name="address.address_2"
          variant="outlined"
          inputRef={register}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="locality"
          error={errors?.address?.locality != undefined}
          label="Localidade (Cidade -  Estado)"
          margin="normal"
          name="address.locality"
          required
          variant="outlined"
          inputRef={register({
            required: true,
          })}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </StyledForm>
    </>
  );
}
