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
import { OptionItems, ProductOption } from '../api/products';
import Typography from '@material-ui/core/Typography';
import { check } from 'prettier';

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

const optionInitItems: OptionItems[] = [
  {
    addPrice: "0.00",
    id: 0,
    name: "Opção",
    paused: false,
  },
];

type InfoType = Omit<ProductOption, 'items' | 'id'>;

const initForm: InfoType = {
  maxItems: 0,
  minItems: 0,
  name: '',
  required: false,
  type: 'single',
};

type OptionItemModalProps = {
  onClose?: () => void;
  open?: boolean;
  option?: ProductOption;
};
export default function OptionItemModal(props: OptionItemModalProps) {
  const { open = false, option, onClose } = props;

  const [info, setInfo] = React.useState<InfoType>(initForm);
  const [items, setItems] = React.useState<OptionItems[]>(optionInitItems);

  React.useEffect(() => {
    if (option) {
      console.log(option);
      const { id, items, ...rest } = option;
      setItems(items);
      setInfo(rest);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;

    const newValue = name === 'required' ? checked : value;

    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: newValue,
    }));
  };

  const addOption = () => {
    setItems((prevItems) => [...prevItems, ...optionInitItems]);
  }

  const modalTitle = option ? 'Editar opção' : 'Criar nova opção';

  const handleClose = () => {
    setInfo(initForm);
    setItems(optionInitItems);
    onClose?.();
  }

  return (
    <Dialog
      aria-labelledby="option-dialog-title"
      fullWidth
      open={open}
      scroll="paper"
      onClose={handleClose}
    >
      <DialogTitle id="option-dialog-title">
        {modalTitle}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="option-name"
              label="Título da opção"
              onChange={handleChange}
              value={info.name}
              variant="outlined"
              name="name"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Quantos itens podem ser escolhidos?</FormLabel>
              <StyledDiv>
                <TextField
                  id="option-select"
                  label="Tipo de seleção"
                  name="type"
                  onChange={handleChange}
                  select
                  value={info.type}
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
                  checked={info.required}
                  color="primary"
                  name="required"
                  onChange={handleChange}
                />
              }
              label="Opção requerida"
            />
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              <Typography variant="button">Item</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="button">Preço Adicional</Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={1} />
            {items.map((v, i) => (
              <>
                <Grid item xs={6}>
                  <TextField
                    label="Nome"
                    value={v.name}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Nome"
                    value={v.addPrice}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={1} />
              </>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Button
              color="secondary"
              startIcon={<AddIcon />}
              onClick={addOption}
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