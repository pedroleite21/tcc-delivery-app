/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import { AuthContextProvider } from './src/contexts/auth_context';
import theme from './src/theme';

const queryCache = new QueryCache();

export const wrapRootElement = ({ element }) => (
  <ReactQueryCacheProvider queryCache={queryCache}>
    <ThemeProvider theme={theme}>
      <EmotionThemeProvider theme={theme}>
        <SnackbarProvider
          autoHideDuration={3000}
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <AuthContextProvider>
            <CssBaseline />
            {element}
          </AuthContextProvider>
        </SnackbarProvider>
      </EmotionThemeProvider>
    </ThemeProvider>
  </ReactQueryCacheProvider>
);
