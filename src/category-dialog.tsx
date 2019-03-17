import { Observer, observer } from 'mobx-react';
import React from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { CategoryForm } from './category-form';
import { InterestFormStore } from './model/stores';

interface CategoryDialogProps {
  form: InterestFormStore;
  onSave: () => void;
  title: string;
}

@observer
export class CategoryDialog extends React.Component<CategoryDialogProps> {
  render() {
    const { onSave, form, title } = this.props;

    return (
      <Dialog open={form.isVisible} onEscapeKeyDown={form.close} onBackdropClick={form.close}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Observer>
            {() => (
              <CategoryForm
                value={form.title}
                onValueChanged={form.setTitle}
                imageUrl={form.fileUrl}
                onImageChanged={form.setFile}
              />
            )}
          </Observer>
        </DialogContent>

        <DialogActions>
          {form.inProgress ? <CircularProgress style={{ height: 16, width: 16 }} /> : null}
          <Button
            color={'primary'}
            variant={'contained'}
            onClick={onSave}
            disabled={form.error !== undefined || form.inProgress}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
