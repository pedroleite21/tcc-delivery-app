import * as React from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { RouteComponentProps } from '@reach/router';
import { useQuery } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import styled from '../components/styled';
import { getProduct, uploadImage } from '../api/products';
import { getCategories } from '../api/categories';
import ImageUploader from '../components/image_uploader';
import ProductOptions from '../components/product_options';

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const StyledForm = styled.form(({ theme }) => ({
  marginTop: theme.spacing(3),
  width: '100%',
}));

type FoodTypes = {
  basePrice?: string;
  categoryId?: string | number;
  description?: string;
  featured?: boolean;
  image?: File[] | string;
  name?: string;
};

const initData = {
  name: '',
  description: '',
  categoryId: '',
  basePrice: '',
  featured: false,
};

export default function Product(props: RouteComponentProps & { productId?: string | number }) {
  const { productId } = props;

  const {
    register,
    handleSubmit,
    setValue,
    control,
  } = useForm<FoodTypes>({ defaultValues: initData });
  const [initialImage, setInitialImage] = React.useState<string>(undefined);

  const onSubmit = async (data: FoodTypes) => {
    if (data.image && product.image !== data.image) {
      const { imageUrl } = await uploadImage(data.image);
    }
  }

  const { data: categories, isLoading } = useQuery('categories', getCategories);
  const { data: product } = useQuery(
    ["product", productId],
    getProduct,
    {
      enabled: productId,
    },
  );

  React.useEffect(() => {
    if (product) {
      console.log(product);
      setInitialImage(product.image);
      setValue('categoryId', product.categoryId);
      setValue('description', product.description);
      setValue('featured', product.featured);
      setValue('name', product.name);
    }
  }, [product]);

  const pageH2 = productId ? 'Editar produto' : 'Criar novo produto';

  return (
    <>
      <Grid container justify="space-between">
        <Typography variant="h4" component="h2">
          {pageH2}
        </Typography>
        <Button
          color="primary"
          form="product-form"
          size="large"
          startIcon={<SaveIcon />}
          type="submit"
          variant="contained"
        >
          Salvar
        </Button>
      </Grid>
      <StyledDivider />
      <Typography variant="h6" gutterBottom>
        Informações Gerais
      </Typography>
      <StyledForm
        noValidate
        id="product-form"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid spacing={2} container>
          <Grid item xs={12} sm={3}>
            <ImageUploader ref={register} initialImage={initialImage} />
          </Grid>
          <Grid item container xs={12} sm={9} spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                as={
                  <TextField
                    fullWidth
                    id="product-name"
                    label="Nome"
                    variant="outlined"
                  />
                }
                name="name"
                control={control}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {Array.isArray(categories) && categories.length > 0 && (
                <Controller
                  as={
                    <TextField
                      id="product-category"
                      name="categoryId"
                      select
                      label="Categoria"
                      fullWidth
                      variant="outlined"
                    >
                      {categories.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  }
                  name="categoryId"
                  control={control}
                />
              )}
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                fullWidth
                id="product-price"
                inputRef={register}
                label="Preço"
                name="price"
                variant="outlined"
                InputProps={{
                  inputComponent: NumberFormatCustom as any,
                }}
              />
            </Grid> */}
            <Grid item xs={12}>
              <Controller
                as={
                  <TextField
                    fullWidth
                    id="product-description"
                    label="Descrição"
                    multiline
                    name="description"
                    rows={3}
                    variant="outlined"
                  />
                }
                name="description"
                control={control}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Controller
              render={props =>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="featured"
                      color="primary"
                      onChange={e => props.onChange(e.target.checked)}
                      checked={props.value}
                    />
                  }
                  label="Produto em destaque"
                />
              }
              control={control}
              name="featured"
            />
          </Grid>
        </Grid>
      </StyledForm>
      <StyledDivider />
      <Typography variant="h6" gutterBottom>
        Opções
      </Typography>
      <ProductOptions options={product?.options || []} />
    </>
  );
}
