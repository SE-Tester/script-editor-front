import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Grid,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';
import { endpoints } from 'config';
import axios from 'axios';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import { useHistory } from 'react-router-dom';
import switchOn from 'assets/img/switch-on.svg';
import switchOff from 'assets/img/switch-off.svg';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
});

function AlertDialog({ widget, setUpdate }: { widget: any; setUpdate: any }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    axios.delete(endpoints.script.delete(widget.uuid));
    setOpen(false);
    setUpdate();
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
          Вы точно хотите удалить сценарий {widget && widget.name}
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

export default function AutoscriptTable() {
  const [scenarios, setScenarios] = React.useState([]);
  const [handleUpdate, setHandleUpdate] = React.useState(true);
  React.useEffect(() => {
    if (handleUpdate) {
      axios.get(endpoints.script.list).then((response) => {
        setScenarios(response.data);
        setHandleUpdate(false);
      });
    }
  }, [handleUpdate]);
  const history = useHistory();
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push('/dashboard/scripts/detail/new')}
          >
            Создать сценарий
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>№ Сценария</TableCell>
                  <TableCell>Наименование сценария</TableCell>
                  <TableCell>Задержка</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scenarios &&
                  scenarios.map((row) => (
                    <TableRow key={row.uuid}>
                      <TableCell
                        component="th"
                        scope="row"
                        onClick={() =>
                          history.push('/dashboard/scripts/detail/' + row.uuid)
                        }
                      >
                        {row.uuid.slice(0, 6)}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        onClick={() =>
                          history.push('/dashboard/scripts/detail/' + row.uuid)
                        }
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        onClick={() =>
                          history.push('/dashboard/scripts/detail/' + row.uuid)
                        }
                      >
                        {row.settings.testSetting}
                      </TableCell>
                      <TableCell>
                        <IconButton color="secondary">
                          <img src={switchOn} height="40" />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <AlertDialog
                          widget={row}
                          setUpdate={() => setHandleUpdate(true)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
