import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useForm } from 'react-hook-form';
import styled from '../components/styled';
import { addModerator, getModerators, ModeratorData } from '../api/admin';
import { useMutation, useQuery } from 'react-query';
import { useSnackbar } from 'notistack';

const StyledForm = styled.form(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: theme.spacing(1),
  maxWidth: 600,
  width: '100%',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(2)}px 0`,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
}));

const StyledList = styled(List)({
  '> li:nth-of-type(odd)': {
    backgroundColor: '#fff',
  }
});

export default function Moderator() {
  const { enqueueSnackbar } = useSnackbar();

  const {
    errors, handleSubmit, register, reset
  } = useForm<ModeratorData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { data = [], refetch } = useQuery('moderators', getModerators);

  const [postModerator, { isLoading }] = useMutation(addModerator, {
    onSuccess: () => {
      refetch();
      reset();
      enqueueSnackbar('Moderador incluido com sucesso', { variant: 'success' });
    },
    onError: (res) => {
      // @ts-ignore
      enqueueSnackbar(res?.response?.data?.message || 'Ops... ocorreu algum erro', { variant: 'error' });
    }
  });

  const onSubmit = async (data: ModeratorData) => {
    await postModerator(data);
  };

  return (
    <>
      {data.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom>
            Moderadores
          </Typography>
          <StyledList>
            {data.map(({ name, email }) => (
              <ListItem>
                <ListItemAvatar>
                  <StyledAvatar>
                    <PersonIcon />
                  </StyledAvatar>
                </ListItemAvatar>
                <ListItemText
                  primary={name}
                  secondary={email}
                />
              </ListItem>
            ))}
          </StyledList>
          <StyledDivider />
        </>
      )}
      <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography variant="h5" gutterBottom>
          Adicionar moderador
        </Typography>
        <TextField
          autoComplete="off"
          disabled={isLoading}
          error={errors.name != undefined}
          helperText={errors?.name?.message}
          id="name"
          inputRef={register({
            required: 'Insira um nome válido',
          })}
          label="Nome"
          margin="normal"
          name="name"
          required
          variant="outlined"
        />
        <TextField
          autoComplete="off"
          disabled={isLoading}
          error={errors.email != undefined}
          helperText={errors.email && errors.email.message}
          id="email"
          inputRef={register({
            required: 'Insira o e-mail para o moderador',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Insira um e-mail válido',
            },
          })}
          label="Endereço de e-mail"
          margin="normal"
          name="email"
          required
          variant="outlined"
        />
        <TextField
          autoComplete="off"
          disabled={isLoading}
          error={errors.password != undefined}
          helperText={errors.password && errors.password.message}
          id="password"
          inputRef={register({
            required: 'Insira sua senha'
          })}
          label="Senha"
          margin="normal"
          name="password"
          required
          type="password"
          variant="outlined"
        />
        <StyledButton
          color="primary"
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          Adicione moderador
        </StyledButton>
      </StyledForm>
    </>
  );
}
