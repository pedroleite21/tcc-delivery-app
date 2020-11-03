import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import { hideVisually } from 'polished';
import SEO from './seo';
import styled from './styled';

const SplashPageStyled = styled.main(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  backgroundImage: `linear-gradient(-45deg,
    ${theme.palette.primary.light},
    ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100%',
}));

type SplashPageProps = {
  show?: boolean;
}

function SplashPage({ show = false }: SplashPageProps) {
  return (
    <Fade
      in={show}
      timeout={{
        enter: 0,
        exit: 300,
      }}
      unmountOnExit
    >
      <SplashPageStyled>
        <SEO title="Carregando..." />
        <p css={hideVisually()}>Carregando página</p>
        <CircularProgress color="inherit" />
      </SplashPageStyled>
    </Fade>
  );
}

export default SplashPage;