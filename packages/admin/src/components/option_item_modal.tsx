import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import styled from './styled';
import { ProductOption } from '../api/products';

const StyledDiv = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  marginTop: theme.spacing(2),
}));

const selectionTypes = [
  { label: 'Seleção única', id: 'single' },
  { label: 'Seleção múltipla', id: 'multiple' },
  { label: 'Intervalo', id: 'range' },
];

type OptionItemModalProps = {
  onClose?: () => void;
  open?: boolean;
  option?: ProductOption;
};
export default function OptionItemModal(props: OptionItemModalProps) {
  const { open = false, option, onClose } = props;

  const modalTitle = option ? 'Editar opção' : 'Criar nova opção';

  const handleClose = () => {
    onClose?.();
  }

  return (
    <Dialog
      aria-label="Editar opção"
      fullWidth
      open={open}
      scroll="paper"
      onClose={handleClose}
    >
      <DialogTitle id="scroll-dialog-title">
        {modalTitle}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="Título da opção"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Quantos itens podem ser escolhidos?</FormLabel>
              <StyledDiv>
                <TextField
                  id="option-select"
                  label="Tipo de seleção"
                  name="selection"
                  select
                  value="single"
                  variant="outlined"
                >
                  {selectionTypes.map((v, index) => (
                    <MenuItem key={`sel-${index}`} value={v.id}>
                      {v.label}
                    </MenuItem>
                  ))}
                </TextField>
              </StyledDiv>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  // checked={state.checkedB}
                  // onChange={handleChange}
                  name="required"
                  color="primary"
                />
              }
              label="Opção requerida"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="secondary"
              startIcon={<AddIcon />}
            >
              Adicionar Item
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          color="primary"
          variant="contained"
          disableElevation
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}