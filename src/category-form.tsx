import React from 'react';
import { Button, Grid, TextField } from '@material-ui/core';

interface CategoryFormProps {
  value: string;
  onValueChanged: (title: string) => void;
  titleError?: string;
  imageUrl?: string;
  onImageChanged?: (file?: File) => void;
}

export class CategoryForm extends React.Component<CategoryFormProps> {
  render() {
    const { value, titleError, onValueChanged, imageUrl } = this.props;

    return (
      <Grid container={true} style={{ width: 400 }} spacing={8}>
        <Grid item={true} xs={6}>
          <TextField
            value={value}
            onChange={event => onValueChanged(event.target.value)}
            error={titleError !== undefined}
            helperText={titleError}
            label={'Category'}
            autoFocus={true}
          />
        </Grid>
        <Grid item={true} xs={6}>
          {imageUrl ? <img src={imageUrl} width={200} /> : null}
          <input
            accept="image/*"
            id="image-file"
            type="file"
            style={{ display: 'none' }}
            onChange={this.onFileUpload}
          />
          <label htmlFor="image-file">
            <Button variant="contained" component={'span'}>
              Upload
            </Button>
          </label>
        </Grid>
      </Grid>
    );
  }

  private onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    this.props.onImageChanged && this.props.onImageChanged(file ? file : undefined);
  };
}
