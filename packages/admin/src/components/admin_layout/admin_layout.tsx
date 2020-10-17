import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';
import styled from '../styled';
import SEO from '../seo';
import UserProfile from './user_profile';
import mainList from './main_list';
import { getUserInfo } from '../../api/login';

const drawerWidth = 240;

type AdminLayoutProps = {
  children: React.ReactNode;
  title: string;
}

const StyledRoot = styled.div({
  display: 'flex'
});

const StyledMain = styled.main({
  flexGrow: 1,
  height: '100vh',
  overflow: 'auto',
});

const ToolbarSpacing = styled.div(
  // @ts-ignore
  ({ theme }) => theme.mixins.toolbar,
);

const StyledToolbarIcon = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 8px',
  ...theme.mixins.toolbar,
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: 'calc(100% - 64px)',
  paddingBottom: theme.spacing(4),
  paddingTop: theme.spacing(4),
}));

export default function AdminLayout(props: AdminLayoutProps) {
  const { children, title } = props;
  const { userId } = getUserInfo();
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(true);

  const toggleDrawer = () => setDrawerOpen((prevOpen) => !prevOpen);

  const appBarStyle = (theme: Theme) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...drawerOpen && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }
  });

  const drawerPaperStyle = (theme: Theme) => ({
    '> div': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      ...!drawerOpen && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      },
    },

    '.MuiListSubheader-root': {
      opacity: drawerOpen ? 1 : 0,
      transition: theme.transitions.create(['opacity'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  });

  const menuButtonStyle = {
    marginRight: 24,
    ...drawerOpen && {
      display: 'none',
    },
  };

  return (
    <StyledRoot>
      <SEO title={title} />
      <AppBar
        position="absolute"
        css={appBarStyle}
      >
        <Toolbar css={{ paddingRight: 24 }}>
          <IconButton
            aria-label="abra menu"
            color="inherit"
            css={menuButtonStyle}
            edge="start"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            css={{ flexGrow: 1 }}
            variant="h6"
            color="inherit"
            noWrap
          >
            Admin
          </Typography>
          <UserProfile userId={userId} />
        </Toolbar>
      </AppBar>
      <Drawer
        // @ts-ignore
        css={drawerPaperStyle}
        open={drawerOpen}
        variant="permanent"
      >
        <StyledToolbarIcon>
          <IconButton aria-label="feche menu" onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </StyledToolbarIcon>
        <Divider />
        {mainList}
      </Drawer>
      <StyledMain>
        <ToolbarSpacing />
        <StyledContainer maxWidth="lg">
          {children}
        </StyledContainer>
      </StyledMain>
    </StyledRoot>
  );
}