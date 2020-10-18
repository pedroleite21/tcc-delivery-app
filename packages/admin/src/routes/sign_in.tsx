import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FastFoodIcon from '@material-ui/icons/Fastfood';
import Typography from '@material-ui/core/Typography';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { graphql, useStaticQuery } from 'gatsby';
import { RouteComponentProps } from '@reach/router';
import Img from 'gatsby-image';
import { useSnackbar } from 'notistack';

import styled from '../components/styled';
import SEO from '../components/seo';
import { signIn } from '../api/login';
import { useAuthContext } from '../contexts/auth_context';

type SignInData = {
  email: string;
  password: string;
}

const InnerContainer = styled.div(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  margin: theme.spacing(8, 4),
}));

const Image = styled(Img)({
  height: '100%',
  maxHeight: '100vh',
})

const StyledForm = styled.form(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledGrid = styled(Grid)({
  height: '100vh',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.secondary.main,
  margin: theme.spacing(1),
}));

export default function SignIn(props: RouteComponentProps) {
  const data = useStaticQuery(
    graphql`
      query {
        file(relativePath: { eq: "login_image.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }`
  );
  const { enqueueSnackbar } = useSnackbar();
  const { setUserInfo } = useAuthContext();

  const {
    errors, handleSubmit, register,
  } = useForm<SignInData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [login, { isLoading }] = useMutation(signIn, {
    onSuccess: (res) => {
      const { data: { accessToken, id, role } } = res;

      setUserInfo({
        accessToken,
        userId: id,
        role,
      });
    },
    onError: (res) => {
      // @ts-ignore
      const message = res?.response?.data?.message;
      enqueueSnackbar(message || 'Erro', { variant: 'error' });
    },
  });

  const onSubmit = (
    { email, password }: SignInData,
    event: React.ChangeEvent<HTMLFormElement>,
  ) => {
    login({ email, password });
  }

  return (
    // @ts-ignore
    <StyledGrid container component="main">
      <SEO title="Login" />
      <Grid item xs={false} sm={4} md={7}>
        <Image
          fluid={data.file.childImageSharp.fluid}
          alt="Laranjas"
        />
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <InnerContainer>
          <StyledAvatar>
            <FastFoodIcon />
          </StyledAvatar>
          <Typography component="h1" variant="h5">
            Restaurante Admin
          </Typography>
          <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              autoComplete="email"
              autoFocus
              disabled={isLoading}
              error={errors.email != undefined}
              fullWidth
              helperText={errors.email && errors.email.message}
              id="email"
              inputRef={register({
                required: 'Insira seu e-mail',
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
              autoComplete="current-password"
              disabled={isLoading}
              error={errors.password != undefined}
              fullWidth
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
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              Entre
            </StyledButton>
          </StyledForm>
        </InnerContainer>
      </Grid>
    </StyledGrid>
  );
}
