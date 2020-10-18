import * as React from 'react';
import { Link } from 'gatsby';
import Button from '@material-ui/core/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import PencilIcon from '@material-ui/icons/Edit';
import { useQuery } from 'react-query';
import styled from '../components/styled';
import { getCategories, getCategoryItems } from '../api/categories';
import { useAuthContext } from '../contexts/auth_context';
import CategoryModal from '../components/category_modal';

const StyledDiv = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const StyledButtonsDiv = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: theme.spacing(2),

  '> button:first-of-type': {
    marginRight: theme.spacing(1),
  },
}));

const StyledPaper = styled(Paper)({
  display: 'flex',
});

const CategoriesList = styled(List)(({ theme }) => ({
  width: '30%',
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const ProductsList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto',
});

export default function Menu() {
  const { role } = useAuthContext();
  const isAdmin = role === 'admin';

  const [
    selectedCategory,
    setSelectedCategory,
  ] = React.useState<string | number | null>(null);
  const [isCategoryModalOpen, setCategoryModalOpen] = React.useState<boolean>(false);

  const { data: categories, isLoading, refetch } = useQuery('categories', getCategories);
  const { data: products } = useQuery(
    ["items", selectedCategory],
    getCategoryItems,
    { enabled: selectedCategory },
  );

  const toggleCategoryModal = () => {
    setCategoryModalOpen((prevCategoryModalOpen) => {
      const newOpen = !prevCategoryModalOpen;

      if (!newOpen) {
        refetch();
      }

      return newOpen;
    });
  }

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string | number,
  ) => {
    setSelectedCategory((prevSelectedCategory) => {
      if (prevSelectedCategory === id) {
        return null;
      }
      return id;
    });
  };

  return (
    <>
      <StyledDiv>
        <StyledButtonsDiv>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            disabled={isLoading || !isAdmin}
            onClick={toggleCategoryModal}
          >
            {selectedCategory ? 'Edite categoria' : 'Adicione categoria'}
          </Button>
          <Button
            color="secondary"
            component={Link}
            disabled={isLoading || !isAdmin}
            to="/admin/product"
            variant="outlined"
          >
            Adicione produto
        </Button>
        </StyledButtonsDiv>
        <StyledPaper>
          {/* @ts-ignore */}
          <CategoriesList component="nav" aria-label="Selecione categoria">
            {categories?.map(({ id, name }) => (
              <ListItem
                button
                selected={selectedCategory === id}
                key={id}
                onClick={(event) => handleListItemClick(event, id)}
              >
                <ListItemText primary={name} />
                <ListItemSecondaryAction>
                  <ChevronRightIcon />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </CategoriesList>
          {(products && products.length > 0) && (
            <ProductsList>
              {products.map(({ id, name }) => (
                <ListItem
                  key={id}
                >
                  <ListItemText primary={name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit products"
                      component={Link}
                      to={`/admin/product/${id}`}
                    >
                      <PencilIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </ProductsList>
          )}
        </StyledPaper>
      </StyledDiv>
      <CategoryModal
        id={selectedCategory}
        onClose={toggleCategoryModal}
        open={isCategoryModalOpen}
      />
    </>
  );
}