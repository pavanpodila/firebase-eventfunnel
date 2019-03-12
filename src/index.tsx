import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';
import Button from '@material-ui/core/Button';

class App extends React.Component {
  render() {
    return <Button variant={'contained'}>Hello</Button>;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
