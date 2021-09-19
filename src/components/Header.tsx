import React from "react";

import { useRouter } from "next/router";
import { Auth } from "aws-amplify";
import Link from "next/link";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import { Grid, Tooltip } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AddIcon from "@material-ui/icons/Add";
import AlbumIcon from "@material-ui/icons/Album";
import { Button, Menu, MenuItem } from "@material-ui/core";

import { useUser } from "../context/AuthContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: 32,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

export default function Header() {
  const classes = useStyles();
  const router = useRouter();
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signUserOut = async () => {
    await Auth.signOut();
    router.push(`/login`);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Link href="/">
            <Grid
              container
              alignItems="center"
              justifyContent="flex-start"
              style={{
                cursor: "pointer",
              }}
            >
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                style={{
                  marginRight: 0,
                }}
              >
                <AlbumIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Opinions
              </Typography>
            </Grid>
          </Link>
          {user && (
            <Grid container justifyContent="flex-end">
              <Tooltip title="Post an Opinion">
                <IconButton onClick={() => router.push(`/create`)} aria-label="create" color="inherit">
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => signUserOut()}>Sign Out</MenuItem>
              </Menu>
            </Grid>
          )}
          {!user && (
            <>
              <Button variant="outlined" color="primary" onClick={() => router.push(`/login`)}>
                Login
              </Button>
              <Button variant="contained" color="primary" onClick={() => router.push(`/signup`)}>
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
