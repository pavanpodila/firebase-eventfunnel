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

const store = new InterestStore();

class App extends React.Component {
  render() {
    const { form } = store;
    return (
      <Fragment>
        <AuthView auth={store.auth} />
        <Button color={'primary'} variant={'contained'} onClick={form.open}>
          <AddIcon />
          Add Category
        </Button>

        <CategoryDialog form={store.form} onSave={store.saveInterest} />
        <InterestList store={store} />
      </Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
