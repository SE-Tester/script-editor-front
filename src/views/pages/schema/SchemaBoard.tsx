import React from 'react';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
} from '@material-ui/core';
import styled from 'styled-components';
import CameraIcon from '@material-ui/icons/Camera';
import mapImage from 'assets/img/map.png';
import cumImage from 'assets/img/cum.gif';
import electronicMeter from 'assets/img/em2.svg';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from 'axios';
import { endpoints } from 'config';
import { TextView } from 'views/components';
import camImage from 'assets/img/cctv-camera.svg';
import doorImage from 'assets/img/motion-detector.svg';
import noCam from 'assets/img/maxresdefault.jpg';
import { useQuery } from 'react-query';
import _ from 'lodash';

const ContainerWrapper = styled.div`
  position: relative;
`;

const StyledGrid = styled.div`
  position: relative;
`;

const StyledImage = styled.img`
  height: 500px;
`;

const SelfIcon = styled.div`
  position: absolute;
  top: 20px;
  right: 10px;
`;

const SasinDialogImage = styled.div`
  position: absolute;
  top: ${(props: { width?: number; height?: number }) => props.width}px;
  left: ${(props: { width?: number; height?: number }) => props.height}px;
  img {
    width: 30px !important;
    height: 30px;
  }
`;

const BoxImage = styled.div`
  border: 2px solid #8f8b8b;
  font-size: 12px;
  height: 15px;
  width: fit-content;
`;

const WidgetCardWrapper = styled.div`
  width: 100%;
  .uptime {
    font-size: 40px;
  }
`;
const StyledStatus = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid black;
  background-color: ${(props: { status?: boolean }) =>
    props.status ? '#32cd32' : '#dbdbdb'};
`;
const StyledCard = styled(Card)`
  width: 100%;

  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }

  text-align: center !important;
  h4 {
    font-weight: bold;
  }
  img {
    width: 64px;
  }
`;

function FormDialog({
  widget,
  width,
  height,
}: {
  widget?: any;
  width?: number;
  height?: number;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const data = localStorage.getItem('cam');
  const handleChange = () => {
    if (data === 'true') {
      localStorage.setItem('cam', 'false');
    } else {
      localStorage.setItem('cam', 'true');
    }
  };

  return (
    <>
      <SasinDialogImage width={width} height={height}>
        <IconButton
          onClick={handleClickOpen}
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <img src={camImage} />
        </IconButton>
      </SasinDialogImage>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Изображение с камеры Marcoscop1
        </DialogTitle>
        <DialogContent>
          <img width="100%" src={data === 'true' ? cumImage : noCam} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChange} color="primary">
            {data === 'true' ? 'Выключить' : 'Включить'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function AlertDialog({ widget, onUpdate }: { widget: any; onUpdate: any }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    axios.delete(endpoints.devices.create + widget.uuid);
    onUpdate(true);
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <DeleteForeverIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Вы точно хотите удалить устройство {widget && widget.name}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Нет
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Да
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const typeMapper = (data: string) => {
  switch (data) {
    case 'Sassin':
      return electronicMeter;
    case 'Sputnik':
      return doorImage;
    default:
      return camImage;
  }
};
const DeviceWidget = ({
  name,
  data,
  onUpdate,
}: {
  name: string;
  data?: any;
  onUpdate: any;
}) => {
  return (
    <WidgetCardWrapper>
      <StyledCard variant="outlined">
        <CardContent>
          <Grid container direction="column" justify="center" spacing={2}>
            <Grid
              container
              item
              xs={12}
              justify="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <TextView bold>{name}</TextView>
              </Grid>
              <Grid item>
                <StyledStatus />
              </Grid>
            </Grid>
            <Grid item>
              <TextView light>{data.type}</TextView>
            </Grid>
            <Grid item>
              <img src={typeMapper(data.type)} alt="widget image" />
            </Grid>
            <Grid item container justify="space-between" alignItems="center">
              <Grid item>
                <IconButton>
                  <TimerOffIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <AlertDialog onUpdate={onUpdate} widget={data} />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>
    </WidgetCardWrapper>
  );
};

function SasinDialog({
  widget,
  width,
  height,
}: {
  widget?: any;

  width?: number;
  height?: number;
}) {
  const [method, setMethod] = React.useState('line_2_voltage');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log(_.get(widget, `measurements.${method}`));
  const val = parseFloat(_.get(widget, `measurements.${method}`));
  return (
    <>
      <SasinDialogImage width={width} height={height}>
        <IconButton
          onClick={handleClickOpen}
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <img src={electronicMeter} />
        </IconButton>

        <BoxImage>
          {val === 0 ? _.get(widget, `measurements.${method}`) : val.toFixed(2)}
        </BoxImage>
      </SasinDialogImage>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Переменные устройства {widget && widget.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="standard-select-currency"
            select
            label="Переменная"
            fullWidth
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
            }}
            helperText="Выбор показания отображения"
          >
            {Object.keys(_.get(widget, 'measurements')).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Нет
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Да
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
function DoorImage({
  widget,
  width,
  height,
}: {
  widget?: any;

  width?: number;
  height?: number;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <SasinDialogImage width={width} height={height}>
        <IconButton
          onClick={handleClickOpen}
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <img src={doorImage} />
        </IconButton>
        <BoxImage>fdsf</BoxImage>
      </SasinDialogImage>
    </>
  );
}
const roomCoordinates = {
  storage: { width: 20, height: 40 },
  bath: { width: 200, height: 420 },
  wc: { width: 200, height: 600 },
  bedroom: { width: 260, height: 630 },
  garage: { width: 200, height: 100 },
  kitchen: { width: 4, height: 400 },
  lvRoom: { width: 20, height: 600 },
  door: { width: 400, height: 520 },
};

export default function SchemaBoard() {
  const [handleUpdate, setHandleUpdate] = React.useState(true);
  const [intervalMs] = React.useState(500);

  const { status, data, error, isFetching } = useQuery(
    'widgets',
    async () => {
      const res = await axios.get(endpoints.devices.list).then((res) => {
        return res.data;
      });
      return res;
    },
    {
      // Refetch the data every second
      refetchInterval: intervalMs,
    },
  );
  const switchType = (widget) => {
    switch (widget.type) {
      case 'Macroscop':
        return (
          <FormDialog
            key={widget.uuid}
            {...roomCoordinates[
              _.get(widget, 'settings.room', roomCoordinates.lvRoom)
            ]}
            widget={widget}
          />
        );
      case 'Sputnik':
        return (
          <DoorImage
            key={widget.uuid}
            {...roomCoordinates[
              _.get(widget, 'settings.room', roomCoordinates.door)
            ]}
            widget={widget}
          />
        );

      default:
        return (
          <SasinDialog
            key={widget.uuid}
            {...roomCoordinates[
              _.get(widget, 'settings.room', roomCoordinates.storage)
            ]}
            widget={widget}
          />
        );
    }
  };

  return (
    <ContainerWrapper>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <StyledGrid>
            {data && data.map(switchType)}
            <StyledImage src={mapImage} />
          </StyledGrid>
        </Grid>

        <Grid container item xs={12} lg={6} spacing={2}>
          {data &&
            data.map((item) => (
              <Grid item xs={12} md={4}>
                <DeviceWidget
                  key={item.uuid}
                  onUpdate={() => setHandleUpdate(true)}
                  name={item.name}
                  data={item}
                />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
