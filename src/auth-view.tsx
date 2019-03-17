import { observer } from 'mobx-react';
import React from 'react';
import { Avatar, Button, Chip, CircularProgress, Grid, Typography } from '@material-ui/core';
import { Authentication } from './model/auth';

interface Props {
  auth: Authentication;
}

@observer
export class AuthView extends React.Component<Props> {
  render() {
    const {
      auth,
      auth: { isReady, user },
    } = this.props;

    if (isReady) {
      if (user) {
        return (
          <Grid container={true} justify={'flex-end'}>
            <Grid item={true}>
              <Chip avatar={<Avatar src={user.photoURL ? user.photoURL : undefined} />} label={user.displayName} />
              <Typography variant={'body1'}>{user.uid}</Typography>
            </Grid>

            <Grid item={true}>
              <Button variant={'contained'} onClick={auth.logout}>
                Logout
              </Button>
            </Grid>
          </Grid>
        );
      }

      return (
        <Grid container={true} justify={'flex-end'}>
          <Button variant={'contained'} onClick={auth.loginWithGoogle}>
            Login with Google
          </Button>
        </Grid>
      );
    }

    return (
      <Grid container={true} justify={'flex-end'}>
        <CircularProgress />
      </Grid>
    );
  }
}
