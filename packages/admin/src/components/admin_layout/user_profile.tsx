import * as React from 'react';
import { Link } from 'gatsby';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import SignOutIcon from '@material-ui/icons/PowerSettingsNew';
import styled from '../styled';
import { useAuthContext } from '../../contexts/auth_context';

const ListItemIconStyled = styled(ListItemIcon)({
  minWidth: 36,
});

interface LinkMenuItemProps extends MenuItemProps {
  to: string;
  admin?: boolean;
}

export const LinkMenuItem = React.forwardRef((
  { to, children, admin = false, ...rest }: LinkMenuItemProps, ref,
) => {
  const { role } = useAuthContext();

  if (admin && role !== 'admin') return null;

  return (
    // @ts-ignore
    <MenuItem button ref={ref} component={Link} to={to} tabIndex={0} {...rest} >
      {children}
    </MenuItem>
  );
});

type UserProfileProps = {
  userId: string | number | null;
}

function UserProfile({ userId }: UserProfileProps) {
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const anchorRef = React.useRef<null | HTMLButtonElement>(null);

  const { signOutUser } = useAuthContext();

  const handleClick = () => {
    setMenuOpen(true);
  };

  const handleClose = (signOut = false) => {
    if (signOut === true) {
      signOutUser();
    }
    setMenuOpen(false);
  }

  const menuId = 'user-profile-admin';

  return (
    <>
      <ButtonBase
        aria-controls={menuId}
        aria-expanded={menuOpen}
        aria-haspopup="true"
        css={{
          borderRadius: '100%',
          overflow: 'hidden',
        }}
        onClick={handleClick}
        ref={anchorRef}
      >
        <Avatar />
      </ButtonBase>
      <Menu
        anchorEl={anchorRef.current}
        getContentAnchorEl={null}
        id={menuId}
        keepMounted
        onClose={handleClose}
        open={menuOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <LinkMenuItem onClick={() => handleClose()} to="/admin/home">
          <ListItemIconStyled>
            <HomeIcon />
          </ListItemIconStyled>
          <ListItemText primary="Início" />
        </LinkMenuItem>
        <LinkMenuItem onClick={() => handleClose()} to="/admin/profile">
          <ListItemIconStyled>
            <PersonIcon />
          </ListItemIconStyled>
          <ListItemText primary="Perfil" />
        </LinkMenuItem>
        <LinkMenuItem admin onClick={() => handleClose()} to="/admin/settings">
          <ListItemIconStyled>
            <SettingsIcon />
          </ListItemIconStyled>
          <ListItemText primary="Configurações" />
        </LinkMenuItem>
        <MenuItem button onClick={() => handleClose(true)}>
          <ListItemIconStyled>
            <SignOutIcon />
          </ListItemIconStyled>
          <ListItemText primary="Sair" />
        </MenuItem>
      </Menu>
    </>
  );
}

export default UserProfile;
