import { useState } from 'react';
import { connect } from 'react-redux';
import Firebase from '../../firebase';
import mapStateToProps from '../../redux/mapStateToProps';
import { setError, setUser, setLoading } from '../../redux/actions';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import MobileRightMenuSlider from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import './index.scss';
import {
  AppBar,
  Toolbar,
  ListItem,
  IconButton,
  ListItemText,
  Divider,
  List,
  Typography,
  Box,
} from '@material-ui/core';
import colors from '../../layout/colors';

const useStyles = makeStyles((theme) => ({
  menuSliderContainer: {
    width: 250,
    background: colors.primary,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  listItem: {
    color: '#fff',
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  navbar: {
    backgroundColor: colors.primary,
  },
}));

const menuItems = [
  {
    listText: 'HOME',
    path: '/',
  },
  {
    listText: 'ALBUMS',
    path: '/albums',
  },
  {
    listText: 'ACCOUNT',
    path: '/account',
  },
  {
    listText: 'ABOUT LCS-MEMORIES',
    path: '/about-us',
  },
];

const Index = (props) => {
  const [state, setstate] = useState({
    left: false,
  });
  const toggleSlider = (slider, open) => {
    setstate({ ...state, [slider]: open });
  };
  const classes = useStyles();

  const { isAuthenticated } = props.redux_state.user;
  const { setUser, setError, setLoading } = props;

  const sideList = (slider) => (
    <Box className={classes.menuSliderContainer} component="div">
      <Divider />

      <List>
        {menuItems.map((item, key) => (
          <Link
            style={{ textDecoration: 'none' }}
            key={key}
            to={item.path}
            onClick={() => toggleSlider('left', false)}
          >
            <ListItem button>
              <ListItemText
                className={classes.listItem}
                primary={item.listText}
              />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box component="nav">
        <AppBar className={classes.navbar}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => toggleSlider('left', true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              <Link style={{ textDecoration: 'none', color: '#fff' }} to="/">
                LCS MEMORIES
              </Link>
            </Typography>

            <Button color="inherit">
              {isAuthenticated ? (
                <Link
                  to="#"
                  style={{ textDecoration: 'none', color: '#fff' }}
                  onClick={(e) => {
                    e.preventDefault();
                    setLoading(true);

                    Firebase.auth()
                      .signOut()
                      .then(() => {
                        setUser({});
                        setLoading(false);
                      })
                      .catch((error) => {
                        setError(error.message);
                        setLoading(false);
                      });
                  }}
                >
                  Logout
                </Link>
              ) : (
                <Link
                  to="/signin"
                  style={{ textDecoration: 'none', color: '#fff' }}
                >
                  Signin
                </Link>
              )}
            </Button>
            <MobileRightMenuSlider
              anchor="left"
              open={state.left}
              onClose={() => toggleSlider('left', false)}
            >
              {sideList('left')}
            </MobileRightMenuSlider>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default connect(mapStateToProps, { setUser, setError, setLoading })(Index);
