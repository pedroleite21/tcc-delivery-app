import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PlusIcon from '@material-ui/icons/Add';
import PencilIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import update from 'immutability-helper';
import { ProductOption } from '../api/products';
import styled from './styled';
import OptionItemModal from './option_item_modal';

const FlexTypography = styled(Typography)({
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
});

const StyledList = styled(List)(({ theme }) => ({
  marginBottom: theme.spacing(-1),
  marginTop: theme.spacing(-1),
  width: '100%',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

type ProductOptionsProps = {
  options: ProductOption[];
  onOptionsChange: (d: ProductOption[]) => void;
}

export default function ProductOptions(props: ProductOptionsProps) {
  const { options: initialOptions, onOptionsChange } = props;
  const [options, setOptions] = React.useState<ProductOption[]>(initialOptions);
  const [expanded, setExpanded] = React.useState<string | number | false>(false);

  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);
  const [selectedOption, setSelectedOption] = React.useState<ProductOption | null>(null);

  React.useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  const openModal = (index?: number) => {
    setSelectedOption(typeof index === 'number' ? options[index] : null);
    setModalOpen(true);
  }

  const closeModal = () => {
    setSelectedOption(null);
    setModalOpen(false);
  }

  const handleChange = (panel: string | number) => (_, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const saveOptionsItens = (d: ProductOption) => {
    if (d.id) {
      const index = options.findIndex(({ id }) => id === d.id);
      if (index !== -1) {
        setOptions((prevOptions) => {
          const newOptions = update(
            prevOptions,
            { [index]: { $merge: d } }
          );
          onOptionsChange?.(newOptions);
          return newOptions;
        });
      }
    } else {
      setOptions((prevOptions) => {
        const newOptions = update(
          prevOptions,
          { $push: [d] }
        );
        onOptionsChange?.(newOptions);
        return newOptions;
      });
    }
    setModalOpen(false);
  }

  return (
    <>
      <Grid container spacing={2} direction="column">
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<PlusIcon />}
            onClick={() => openModal()}
          >
            Adicionar opção
        </Button>
        </Grid>
        <Grid item xs={12}>
          {options.length > 0 && (
            options.map(({ name, items }, index) => (
              <Accordion
                expanded={expanded === index}
                key={`options-${index}`}
                onChange={handleChange(index)}
                variant="outlined"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`options-${index}-content`}
                  id={`options-${index}-header`}
                >
                  <FlexTypography
                    variant="button"
                  >
                    {name}
                  </FlexTypography>
                  {expanded === index && (
                    <IconButton
                      aria-label="Editar opção"
                      onFocus={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation();
                        openModal(index);
                      }}
                    >
                      <PencilIcon />
                    </IconButton>
                  )}
                </AccordionSummary>
                <Divider />
                <AccordionDetails id={`options-${index}-content`}>
                  <StyledList dense>
                    {items.length > 0 && (
                      items.map((v, i) => (
                        <StyledListItem key={`options-${index}-item-${i}`} button>
                          <ListItemText
                            primary={v.name}
                          />
                        </StyledListItem>
                      ))
                    )}
                  </StyledList>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Grid>
      </Grid>
      <OptionItemModal
        onClose={closeModal}
        open={isModalOpen}
        option={selectedOption}
        onSave={saveOptionsItens}
      />
    </>
  );
}