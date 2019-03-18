import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';
import './model/firebase';
import { InterestStore } from './model/stores';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { AuthView } from './auth-view';
import { CategoryDialog } from './category-dialog';
import { InterestList } from './interest-list';
import { CircularProgress } from '@material-ui/core/es';
import { Observer } from 'mobx-react';

const store = new InterestStore();

class App extends React.Component {
  render() {
    const { form } = store;
    return (
      <Fragment>
        <AuthView auth={store.auth} />
        <Observer>
          {() => (
            <Button color={'primary'} variant={'contained'} onClick={form.open}>
              <AddIcon />
              Add Category
              {store.isLoading ? (
                <CircularProgress style={{ width: 20, height: 20, marginLeft: 8, color: 'white' }} />
              ) : null}
            </Button>
          )}
        </Observer>

        <CategoryDialog form={store.form} onSave={store.addInterest} title={'Add new Category'} />
        <InterestList store={store} />
      </Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
