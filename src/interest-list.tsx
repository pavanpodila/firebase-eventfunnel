import React from 'react';
import { Observer } from 'mobx-react';
import { Grid, IconButton, Paper, Typography } from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import EditIcon from '@material-ui/icons/Edit';
import { InterestStore } from './model/stores';

interface InterestListProps {
  store: InterestStore;
}

export const InterestList: React.FunctionComponent<InterestListProps> = ({ store }) => {
  return (
    <Grid spacing={16} container>
      <Observer>
        {() => {
          return store.interests.map(x => (
            <Grid key={x.id} item xs={3}>
              <Paper style={{ padding: 8 }}>
                <img src={x.imageUrl} height={128} />
                <Typography variant={'title'}>{x.title || '<Untitled>'}</Typography>
                <Typography variant={'caption'}>{x.id}</Typography>

                <IconButton>
                  <EditIcon />
                </IconButton>
                <IconButton>
                  <StarBorderIcon />
                </IconButton>
              </Paper>
            </Grid>
          ));
        }}
      </Observer>
    </Grid>
  );
};
