import React, { useState } from 'react';

import { useStyles } from './styles';
import { useUsuario } from '../../context/UsuarioContext';
import { useHistory } from 'react-router-dom';

//material-ui
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import useContrassenhaVencer from '../../Hooks/useContrassenha';
import TodayRoundedIcon from '@material-ui/icons/TodayRounded';
import SpeakerNotesRoundedIcon from '@material-ui/icons/SpeakerNotesRounded';
import SpeakerNotesOffRoundedIcon from '@material-ui/icons/SpeakerNotesOffRounded';
import WorkRoundedIcon from '@material-ui/icons/WorkRounded';
import BallotRoundedIcon from '@material-ui/icons/BallotRounded';
import AssignmentIndRoundedIcon from '@material-ui/icons/AssignmentIndRounded';
import ScreenLockLandscapeRoundedIcon from '@material-ui/icons/ScreenLockLandscapeRounded';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';


function Header({ title }) {
  const history = useHistory();
  const anchor = 'left';
  const classes = useStyles();
  const { usu_codigo, login, isDarkTheme, setIsDarkTheme } = useUsuario();
  const [showMenu, setshowMenu] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const contrassenhasVencer = useContrassenhaVencer();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleClickContrassenhaVencer = () => {
    history.push({ pathname: '/licencas', state: { licencasVencer: contrassenhasVencer } });
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{usu_codigo > 0 ? login : 'Usuário não logado'}</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <FormControlLabel
          control={<Switch checked={isDarkTheme} onChange={() => setIsDarkTheme(!isDarkTheme)} name="theme" />}
          label={isDarkTheme ? 'Tema escuro' : 'Tema claro'}
          color={isDarkTheme ? 'secondary' : 'primary'}
        />
        <IconButton aria-label={`Vc tem ${contrassenhasVencer.length} novas notificações`} color="inherit" onClick={handleClickContrassenhaVencer}>
          <Badge badgeContent={contrassenhasVencer.length} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notificações</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>{usu_codigo > 0 ? login : 'Usuário não logado'}</p>
      </MenuItem>
    </Menu>
  );


  return (
    <div className={classes.grow}>
      <Drawer anchor={anchor} open={showMenu}>
        <div
          className={clsx(classes.list, {
            [classes.fullList]: anchor === 'top' || anchor === 'bottom',
          })}
          role="presentation"
          onClick={() => setshowMenu(!showMenu)}
          onKeyDown={(event) => setshowMenu(!showMenu)}
        >
          <List>
            <ListItem button key='Quadro Kanban' onClick={() => history.push('/QuadroKanban')}>
              <ListItemIcon><DashboardRoundedIcon /></ListItemIcon>
              <ListItemText primary='Quadro Kanban' />
            </ListItem>
            <ListItem button key='Calendário' onClick={() => history.push('/Calendario')}>
              <ListItemIcon><TodayRoundedIcon /></ListItemIcon>
              <ListItemText primary='Calendário' />
            </ListItem>
            <ListItem button key='Ocorrências' onClick={() => history.push('/ocorrencias')}>
              <ListItemIcon><SpeakerNotesRoundedIcon /></ListItemIcon>
              <ListItemText primary='Ocorrências' />
            </ListItem>
            <ListItem button key='Ocorrências Finalizadas' onClick={() => history.push('/ocorrenciasFinalizadas')}>
              <ListItemIcon><SpeakerNotesOffRoundedIcon /></ListItemIcon>
              <ListItemText primary='Ocorrências Finalizadas' />
            </ListItem>
            <ListItem button key='Ordens Em Andamento' onClick={() => history.push('/ordensAndamento')}>
              <ListItemIcon><WorkRoundedIcon /></ListItemIcon>
              <ListItemText primary='Ordens Em Andamento' />
            </ListItem>
            <ListItem button key='Scrum' onClick={() => history.push('/scrum')}>
              <ListItemIcon><BallotRoundedIcon /></ListItemIcon>
              <ListItemText primary='Scrum' />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key='Clientes' onClick={() => history.push('/clientes')}>
              <ListItemIcon><AssignmentIndRoundedIcon /></ListItemIcon>
              <ListItemText primary='Clientes' />
            </ListItem>
            <ListItem button key='Licenças' onClick={() => history.push('/licencas')}>
              <ListItemIcon><ScreenLockLandscapeRoundedIcon /></ListItemIcon>
              <ListItemText primary='Licenças' />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={() => setshowMenu(!showMenu)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {title}
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <FormControlLabel
              control={<Switch checked={isDarkTheme} onChange={() => setIsDarkTheme(!isDarkTheme)} name="theme" />}
              label={isDarkTheme ? 'Tema escuro' : 'Tema claro'}
              color={isDarkTheme ? 'secondary' : 'primary'}
            />
            <IconButton aria-label={`Vc têm ${contrassenhasVencer.length} novas notificações`} color="inherit" onClick={handleClickContrassenhaVencer}>
              <Badge badgeContent={contrassenhasVencer.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="conta de usuário"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="monstrar mais"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

export default Header;