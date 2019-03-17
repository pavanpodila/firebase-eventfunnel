import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { Card, CardActions, CardContent, CardMedia, Grid, IconButton, Typography } from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import EditIcon from '@material-ui/icons/Edit';
import { InterestStore } from './model/stores';
import { CategoryDialog } from './category-dialog';
import placeholderImg from './placeholder-300x225.png';

interface InterestListProps {
  store: InterestStore;
}

@observer
export class InterestList extends React.Component<InterestListProps> {
  render() {
    const { store } = this.props;

    return (
      <Fragment>
        <Grid spacing={16} container>
          {store.interests.map(x => (
            <Grid key={x.id} item xs={3}>
              <Card style={{ height: 300 }}>
                <CardMedia image={x.imageUrl || placeholderImg} style={{ height: 150 }} />
                <CardContent>
                  <Typography variant={'title'}>{x.title || '<Untitled>'}</Typography>
                  <Typography variant={'caption'}>{x.id}</Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => store.openInterestEditor(x)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <StarBorderIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <CategoryDialog form={store.editForm} onSave={store.saveInterest} title={'Edit Category'} />
      </Fragment>
    );
  }
}
