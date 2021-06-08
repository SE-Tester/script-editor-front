import classes from '*.module.css';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { endpoints } from 'config';
import React from 'react';
import styled from 'styled-components';
import { TextView } from 'views/components';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Field, Form } from 'react-final-form';
import uuid from 'uuid';
import widgetImage from 'assets/img/em2.svg';
import camImage from 'assets/img/cctv-camera.svg';
import doorImage from 'assets/img/motion-detector.svg';
import _, { isBuffer } from 'lodash';

const typeMapper = (data: string) => {
  switch (data) {
    case 'Sassin':
      return widgetImage;
    case 'Sputnik':
      return doorImage;
    default:
      return camImage;
  }
};

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

const FieldSubText = styled.p`
  font-size: 12px;
  margin-bottom: 7px;
  font-weight: 550;
`;

function AlertDialog({ widget, onUpdate }: { widget: any; onUpdate: any }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    axios.delete(endpoints.devices.create + widget.uuid).then(() => {
      onUpdate(true);
      handleClose();
    });
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

const DeviceWidget = ({
  name,
  data,
  onUpdate,
}: {
  name: string;
  data?: any;
  onUpdate: any;
}) => {
  const status = localStorage.getItem(data.uuid);
  React.useEffect(() => {
    console.log(status);
  }, [status]);
  return (
    <WidgetCardWrapper>
      <StyledCard variant="outlined">
        <CardContent>
          <Grid container direction="column" justify="center" spacing={2}>
            <Grid
              container
              xs={12}
              justify="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <TextView bold>{name}</TextView>
              </Grid>
              <Grid item>
                <StyledStatus status={status === 'true'} />
              </Grid>
            </Grid>
            <Grid item>
              <TextView light>{data.type}</TextView>
            </Grid>
            <Grid item>
              <img src={typeMapper(data.type)} alt="widget image" />
            </Grid>
            <Grid item>
              <TextView light>Место установки:</TextView>
            </Grid>
            <Grid item>
              <TextView light>
                {_.get(Rooms, _.get(data, 'settings.room'))}
              </TextView>
            </Grid>
            <Grid item container justify="space-between" alignItems="center">
              <Grid item>
                <IconButton
                  onClick={() => {
                    if (status) {
                      localStorage.setItem(data.uuid, 'false');
                    } else {
                      localStorage.setItem(data.uuid, 'true');
                    }
                  }}
                >
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

const Rooms = {
  storage: 'Storage',
  bath: 'Bath room',
  wc: 'Wc Room',
  bedroom: 'BedRoom',
  garage: 'Garage',
  kitchen: 'Kitchen',
  lvRoom: 'Living Room',
  door: 'Door',
};

const baseDivice = {
  uuid: uuid.v4(),
  name: '',
  type: 'Sassin',
  settings: {
    serial: uuid.v4() + '-sn',
  },
};

function FormDialog({ onUpdate }: { onUpdate: any }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmitDevice = (values: any) => {
    if (values.uuid === '') {
      values.uuid = uuid.v4();
    }
    if (values.settings.serial === '') {
      values.settings.serial = uuid.v4() + '-sn';
    }
    axios.post(endpoints.devices.create, values).then((res) => {
      handleClose();
      onUpdate();
    });
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Добавить устройство
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Добавление нового устройства
        </DialogTitle>
        <Form
          onSubmit={handleSubmitDevice}
          initialValues={{
            uuid: '',
            name: '',
            type: 'Sassin',
            settings: {
              serial: '',
            },
          }}
          validate={(values) => {
            console.log(values);
            return {};
          }}
          render={({ handleSubmit, invalid }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <DialogContentText>
                  Чтобы добавить новое устройство необходимо заполнить все поля
                </DialogContentText>

                <Field name="name">
                  {({ input, meta }) => (
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Имя устройства"
                      type="text"
                      fullWidth
                      required
                      {...input}
                    />
                  )}
                </Field>
                <Field name="type">
                  {({ input, meta }) => (
                    <TextField
                      autoFocus
                      margin="dense"
                      id="type"
                      label="Тип устройства"
                      select
                      required
                      fullWidth
                      {...input}
                    >
                      {['Sassin', 'Macroscop', 'Sputnik'].map((item) => (
                        <MenuItem value={item}>{item}</MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
                <Field name="uuid">
                  {({ input, meta }) => (
                    <TextField
                      autoFocus
                      margin="dense"
                      id="uuid"
                      label="UUID устройства"
                      type="text"
                      fullWidth
                      {...input}
                    />
                  )}
                </Field>
                <FieldSubText>
                  Оставьте поле пустым, если не знаете идентификатор устройства
                </FieldSubText>
                <Field name="settings.serial">
                  {({ input, meta }) => (
                    <TextField
                      autoFocus
                      margin="dense"
                      id="settings.serial"
                      label="Серийный номер устройства"
                      type="text"
                      fullWidth
                      {...input}
                    />
                  )}
                </Field>
                <FieldSubText>
                  Оставьте поле пустым, если не знаете серийный номер устройства
                </FieldSubText>
                <Field name="settings.room">
                  {({ input, meta }) => (
                    <TextField
                      autoFocus
                      margin="dense"
                      id="type"
                      label="Место установки устройства"
                      select
                      required
                      fullWidth
                      {...input}
                    >
                      {Object.keys(Rooms).map((item) => (
                        <MenuItem value={item}>{Rooms[item]}</MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Отменить
                </Button>
                <Button disabled={invalid} type="submit" color="primary">
                  Создать
                </Button>
              </DialogActions>
            </form>
          )}
        />
      </Dialog>
    </div>
  );
}

function HomePage() {
  const [widgets, setWidgets] = React.useState<any[]>([]);
  const [handleUpdate, setHandleUpdate] = React.useState(true);
  React.useEffect(() => {
    if (handleUpdate) {
      axios.get(endpoints.devices.list).then((res) => {
        setWidgets(res.data);
        setHandleUpdate(false);
      });
    }
  }, [handleUpdate]);

  return (
    <Grid container spacing={5} direction="column">
      <Grid item>
        <Typography variant="h3">Главная</Typography>
      </Grid>
      <Grid item>
        <FormDialog onUpdate={() => setHandleUpdate(true)} />
      </Grid>
      <Grid item container spacing={3}>
        {widgets &&
          widgets.map((item) => (
            <Grid item xs={12} lg={2}>
              <DeviceWidget
                onUpdate={() => setHandleUpdate(true)}
                name={item.name}
                data={item}
              />
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
}

export default HomePage;
