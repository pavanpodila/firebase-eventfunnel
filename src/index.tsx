import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';
import './firebase';
import { FirestoreCollection } from './mobx-firestore';
import { Observer } from 'mobx-react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import { Authentication } from './auth';
import { AuthView } from './auth-view';

interface Interest {
  id: string;
  title: string;
}
const interests = new FirestoreCollection<Interest>('/interests');
const auth = new Authentication();

class App extends React.Component {
  render() {
    return (
      <Fragment>
        <AuthView auth={auth} />
        <List>
          <Observer>
            {() => {
              return interests.items.map(x => (
                <ListItem key={x.id} button={true}>
                  <ListItemText secondary={x.id} primary={x.title} />
                  <ListItemIcon>
                    <StarIcon />
                  </ListItemIcon>
                </ListItem>
              ));
            }}
          </Observer>
        </List>
      </Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
