import { observer } from 'mobx-react';
import React from 'react';
import { Avatar, Button, Chip, CircularProgress } from '@material-ui/core';
import { Authentication } from './auth';

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
        return <Chip avatar={<Avatar src={user.photoURL ? user.photoURL : undefined} />} label={user.displayName} />;
      }

      return (
        <div>
          <Button variant={'contained'} onClick={auth.loginWithGoogle}>
            Login with Google
          </Button>
        </div>
      );
    }

    return <CircularProgress />;
  }
}
