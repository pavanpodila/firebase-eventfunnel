import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';
import './firebase';
import { InterestStore } from './stores';
import { observer, Observer } from 'mobx-react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AddIcon from '@material-ui/icons/Add';
import { AuthView } from './auth-view';

const store = new InterestStore();

interface AddCategoryFormProps {
  store: InterestStore;
}

@observer
class AddCategoryForm extends React.Component<AddCategoryFormProps> {
  render() {
    const {
      store,
      store: { editingError },
    } = this.props;

    return (
      <Fragment>
        <TextField
          value={store.editingInterest}
          onChange={event => store.setInterest(event.target.value)}
          error={editingError !== undefined}
          helperText={editingError}
          label={'Category'}
          autoFocus={true}
        />
      </Fragment>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <Fragment>
        <AuthView auth={store.auth} />
        <Button color={'primary'} variant={'contained'} onClick={store.openForm}>
          <AddIcon />
          Add Category
        </Button>

        <Observer>
          {() => (
            <Dialog open={store.isFormVisible} onEscapeKeyDown={store.closeForm} onBackdropClick={store.closeForm}>
              <DialogTitle>Add a new Category</DialogTitle>
              <DialogContent>
                <AddCategoryForm store={store} />
              </DialogContent>

              <DialogActions>
                {store.isAdding ? <CircularProgress style={{ height: 16, width: 16 }} /> : null}
                <Button
                  color={'primary'}
                  variant={'contained'}
                  onClick={store.saveInterest}
                  disabled={store.editingError !== undefined || store.isAdding}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Observer>

        <List>
          <Observer>
            {() => {
              return store.interests.map(x => (
                <ListItem key={x.id} button={true}>
                  <ListItemText secondary={x.id} primary={x.title} />
                  <ListItemIcon>
                    <StarBorderIcon />
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
