import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import { useQuery, useMutation } from 'react-query';
import { createCategory, getCategory, updateCategoryName } from '../api/categories';

type ModalCategoryProps = {
  id?: string | number;
  name?: string | null;
  onClose?: () => void;
  open?: boolean;
};

export default function CategoryModal(props: ModalCategoryProps) {
  const { id, open, onClose } = props;
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    onClose?.();
  }

  const { data, isLoading: isLoadingCategory } = useQuery(["category", id], getCategory, { enabled: id });
  const [create, { isLoading: isLoadingCreate }] = useMutation(createCategory, {
    onSuccess: () => {
      enqueueSnackbar('Categoria criada com sucesso', { variant: 'success' });
    },
    onError: (res) => {
      // @ts-ignore
      const message = res?.response?.data?.message;
      enqueueSnackbar(message || 'Erro', { variant: 'error' });
    },
    onSettled: () => {
      handleClose();
    },
  });
  const [update, { isLoading: isLoadingUpdate }] = useMutation(updateCategoryName, {
    onSuccess: () => {
      enqueueSnackbar('Nome de categoria atualizado com sucesso', { variant: 'success' });
    },
    onError: (res) => {
      // @ts-ignore
      const message = res?.response?.data?.message;
      enqueueSnackbar(message || 'Erro', { variant: 'error' });
    },
    onSettled: () => {
      handleClose();
    },
  });

  const isLoading = isLoadingCategory || isLoadingCreate || isLoadingUpdate;

  const inputRef = React.useRef<HTMLInputElement>();
  const [errorMessage, setErrorMessage] = React.useState<string>(null);

  const buttonTitle = id ? 'Editar' : 'Criar';
  const modalTitle = id ? 'Editar categoria' : 'Criar nova categoria';
  const modalTitleId = 'category-modal-title';
  const modalContentId = 'category-modal-content';

  const handleChange = () => {
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = () => {
    const { value } = inputRef.current;

    if (value.length === 0) {
      setErrorMessage('Insira um nome válido');
      return;
    }

    if (data?.name === value) {
      handleClose();
      return;
    }

    if (id) {
      update({
        id,
        name: value,
      });
    } else {
      create({
        name: value,
      });
    }
  };

  return (
    <Dialog
      aria-labelledby={modalTitleId}
      aria-describedby={modalContentId}
      fullWidth
      onClose={handleClose}
      open={open}
      scroll="paper"
    >
      <DialogTitle id={modalTitleId}>
        {modalTitle}
      </DialogTitle>
      <DialogContent dividers id={modalContentId}>
        <TextField
          defaultValue={data?.name}
          error={errorMessage !== null}
          helperText={errorMessage}
          id="name-category-input"
          inputRef={inputRef}
          label="Nome da categoria"
          onChange={handleChange}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button
          color="primary"
          disabled={isLoading}
          onClick={handleSubmit}
          variant="contained"
          disableElevation
        >
          {isLoading
            ? <CircularProgress size={20} />
            : buttonTitle
          }
        </Button>
      </DialogActions>
    </Dialog>
  );

}

