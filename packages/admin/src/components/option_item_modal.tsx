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
import Typography from '@material-ui/core/Typography';
import update from 'immutability-helper';
import styled from './styled';
import { OptionItems, ProductOption } from '../api/products';

const StyledDiv = styled(Grid)(({ theme }) => ({
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
  onSave?: (p: ProductOption) => void;
  open?: boolean;
  option?: ProductOption;
};
export default function OptionItemModal(props: OptionItemModalProps) {
  const { open = false, option, onClose, onSave } = props;

  const [info, setInfo] = React.useState<InfoType>(initForm);
  const [items, setItems] = React.useState<OptionItems[]>(optionInitItems);

  React.useEffect(() => {
    if (option) {
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
    setItems((prevItems) => {
      const newItems = update(prevItems, { $push: [...optionInitItems] });
      return newItems;
    });
  }

  const modalTitle = option ? 'Editar opção' : 'Criar nova opção';

  const handleClose = () => {
    setInfo(initForm);
    setItems(optionInitItems);
    onClose?.();
  }

  const handleSave = () => {
    onSave?.({
      ...info,
      id: null,
      items,
    });
    setInfo(initForm);
    setItems(optionInitItems);
  }

  const handleOptionChange = (i: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setItems((prevItems) => {
      const newItems = update(prevItems, {
        [i]: { $merge: { [name]: value } }
      });
      return newItems;
    });
  };

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
              <StyledDiv item container xs={12} spacing={1}>
                <Grid item xs={5}>
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
                </Grid>
                {info.type !== 'single' && (
                  <>
                    <Grid item xs={3}>
                      <TextField
                        id="min-items"
                        label="Min."
                        name="minItems"
                        onChange={handleChange}
                        type="number"
                        value={info.minItems}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Typography variant="overline">à</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="max-items"
                        label="Máx."
                        name="maxItems"
                        onChange={handleChange}
                        type="number"
                        value={info.maxItems}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}
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
            <Grid item xs={2}>
              <Typography variant="button" id="checkbox-label">Pausado</Typography>
            </Grid>
            {items.map((v, i) => (
              <>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    name="name"
                    onChange={handleOptionChange(i)}
                    value={v.name}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Preço adicional"
                    name="addPrice"
                    onChange={handleOptionChange(i)}
                    value={v.addPrice}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Checkbox
                    aria-labelledby="checkbox-label"
                    // checked={info.required}
                    color="primary"
                    name="paused"
                    // onChange={handleChange}
                  />
                </Grid>
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
          onClick={handleSave}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}