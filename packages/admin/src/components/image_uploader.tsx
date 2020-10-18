import * as React from 'react';
import { hideVisually } from 'polished';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { useMergeRefs } from 'use-callback-ref';
import styled from './styled';

type ImageUploadProps = {
  initialImage?: string;
};

type ImageUploadRef = HTMLInputElement;

const HiddenInput = styled.input({
  ...hideVisually(),
});

const StyledGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  position: 'relative',
}));

const ImagePlaceholder = styled(Card)(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.grey['300'],
  color: theme.palette.grey['600'],
  display: 'flex',
  height: 100,
  justifyContent: 'center',
}));

const DeleteButton = styled(Fab)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(-1),
  right: theme.spacing(-1),
  zIndex: 1,
}));

const ImageUploader = React.forwardRef<ImageUploadRef, ImageUploadProps>(
  (props, ref) => {
    const {
      initialImage
    } = props;
    const [image, setImage] = React.useState<string>(undefined);
    const inputRef = React.useRef<ImageUploadRef>(null);

    React.useEffect(() => {
      if (initialImage) {
        setImage(initialImage);
      }
    }, [initialImage]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.files[0]) {
        setImage(URL.createObjectURL(event.currentTarget.files[0]));
      } else {
        setImage(null);
      }
    }

    const handleDelete = () => {
      const { current: input } = inputRef;

      if (input) {
        input.value = '';
        setImage(null);
      }
    }

    const buttonLabel = image ? 'Altere Imagem' : 'Insira imagem';

    return (
      <Grid item container direction="column">
        <StyledGrid item>
          {image
            ? (
              <>
                <Card>
                  <CardMedia
                    component="img"
                    alt="Imagem do produto"
                    height="100"
                    image={image}
                  />
                </Card>
                <DeleteButton
                  aria-label="Exclua imagem"
                  size="small"
                  color="secondary"
                  onClick={handleDelete}
                >
                  <DeleteIcon />
                </DeleteButton>
              </>
            )
            : (
              <ImagePlaceholder
                elevation={0}
              >
                <PhotoCamera color="inherit" fontSize="large" />
              </ImagePlaceholder>
            )
          }
        </StyledGrid>
        <HiddenInput
          accept="image/*"
          id="image-upload-input"
          name="image"
          onChange={handleChange}
          ref={useMergeRefs([inputRef, ref])}
          type="file"
        />
        <label htmlFor="image-upload-input">
          <Button
            color="primary"
            component="span"
            fullWidth
            startIcon={<PhotoCamera />}
            variant="contained"
          >
            {buttonLabel}
          </Button>
        </label>
      </Grid>
    );
  });

export default ImageUploader;
