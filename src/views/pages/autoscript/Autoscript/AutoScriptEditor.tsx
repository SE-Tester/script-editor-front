import React from 'react';
import { Grid, Typography, TextField, MenuItem } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import uuid from 'uuid';
import axios from 'axios';
import { endpoints } from 'config';
import { useParams, useHistory } from 'react-router';


import { SSL_OP_NETSCAPE_CHALLENGE_BUG } from 'node:constants';
import _ from 'lodash';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));
const CompareOperators = [
  {
    name: '=',
    value: 'EQ',
  },
  {
    name: '>',
    value: 'GT',
  },
  {
    name: '<',
    value: 'LT',
  },

  {
    name: '!=',
    value: 'NQ',
  },
  {
    name: '=>',
    value: 'GE',
  },
  {
    name: '<=',
    value: 'LE',
  },
];

const AutoScriptCondition = ({
  devices,
  formName,
  isSetValue,
  title,
  type,
  fields,
}: any) => {
  const operators = isSetValue ? [CompareOperators[0]] : CompareOperators;
  const types = devices
    .filter((x) => x && x.measurements)
    .map((item) =>
      Object.keys(item.measurements).map((x) => ({
        path: item.name + '_' + x,
        uuidDevice: item.uuid,
      })),
    )
    .flat();

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item>
          <Grid container alignItems="baseline">
            <Grid item>
              <Button size="large">{title}</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Field name={`${formName}.uuidDevice`}>
            {({ input: deviceUUID }) => (
              <Field name={`${formName}.source`}>
                {({ input }) => (
                  <TextField
                    size="small"
                    id="outlined-basic"
                    label="Условие"
                    select
                    variant="outlined"
                    helperText="Пожалуйста введите значение"
                    {...input}
                    onChange={(e) => {
                      input.onChange(e.target.value);
                    }}
                    value={input.value}
                  >
                    {types.map((item) => (
                      <MenuItem
                        key={item.uuidDevice}
                        value={item.path}
                        onClick={() => {
                          deviceUUID.onChange(item.uuidDevice);
                        }}
                      >
                        {item.path}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>
            )}
          </Field>
        </Grid>
        <Grid item>
          <Field name={`${formName}.comparer`}>
            {({ input }) => (
              <TextField
                size="small"
                id="outlined-basic"
                label="Оператор"
                select
                variant="outlined"
                helperText="Пожалуйста введите значение"
                {...input}
              >
                {[...operators].map((item) => (
                  <MenuItem key={item.name} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Field>
        </Grid>
        <Grid item>
          <Field name={`${formName}.value.type`}>
            {({ input }) => (
              <TextField
                size="small"
                id="outlined-basic"
                label="Тип"
                select
                variant="outlined"
                helperText="Пожалуйста введите значение"
                onChange={(e) => {
                  input.onChange(e.target.value);
                }}
                value={input.value}
              >
                {[
                  { label: 'Устройство', value: 'device' },
                  { label: 'Значение', value: 'number' },
                  { label: 'Булевое значение', value: 'bool' },
                ].map((item) => (
                  <MenuItem key={item.label} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Field>
        </Grid>
        <Grid item>
          <Field name={`${formName}.value.type`}>
            {({ input: typeInput }) => (
              <Field name={`${formName}.value.value`}>
                {({ input }) => (
                  <TextField
                    size="small"
                    id="outlined-basic"
                    label="Значение"
                    type="number"
                    variant="outlined"
                    helperText="Пожалуйста введите значение"
                    {...input}
                    select={
                      typeInput.value === 'device' || typeInput.value === 'bool'
                    }
                    onChange={(e) => input.onChange(e.target.value)}
                    value={input.value}
                  >
                    {typeInput.value === 'device' &&
                      types.map((item) => (
                        <MenuItem key={item.label} value={item.path}>
                          {item.path}
                        </MenuItem>
                      ))}
                    {typeInput.value === 'bool' &&
                      [
                        { label: 'True', value: 'true' },
                        { label: 'False', value: 'false' },
                      ].map((item) => (
                        <MenuItem key={item.label} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                  </TextField>
                )}
              </Field>
            )}
          </Field>
        </Grid>

        {fields.value.length > 0 && (
          <Grid item>
            <IconButton onClick={() => fields.pop()}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

const AutoScriptSetValue = ({
  devices,
  formName,
  scenario,
  title,
  type,
  fields,
}: any) => {
  const [method, setMethod] = React.useState(
    _.get(Object.keys(_.get(scenario, 'data', {})), '0'),
  );
  const [sourceType, setSourceType] = React.useState('number');
  const methods = devices
    .filter((x) => x.methods)
    .map((device) =>
      Object.keys(device.methods).map((item) => ({
        uuid: uuid.v4(),
        uuidDevice: device.uuid,
        method: item,
        source: device.name + '_' + item,
        sourceValue: _.get(Object.keys(device.methods[item]), '0'),
        sourceType: _.get(
          device,
          `methods.${item}.${_.get(Object.keys(device.methods[item]), '0')}`,
        ),
      })),
    )
    .flat();

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item>
          <Grid container alignItems="baseline">
            <Grid item>
              <Button size="large">{title}</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Field name={`${formName}.uuidDevice`}>
            {({ input: deviceUUID }) => (
              <Field name={`${formName}.method`}>
                {({ input }) => (
                  <TextField
                    size="small"
                    id="outlined-basic"
                    label="Метод"
                    select
                    variant="outlined"
                    helperText="Пожалуйста введите значение"
                    {...input}
                    onChange={(e) => {
                      input.onChange(e.target.value.split('_')[1]);
                    }}
                    value={deviceUUID.value + '_' + input.value}
                  >
                    {methods.map((item) => (
                      <MenuItem
                        key={item.uuidDevice}
                        value={item.uuidDevice + '_' + item.method}
                        onClick={() => {
                          deviceUUID.onChange(item.uuidDevice);
                          setMethod(item.sourceValue);
                          setSourceType(item.sourceType);
                        }}
                      >
                        {item.source}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>
            )}
          </Field>
        </Grid>
        <Grid item>
          <React.Fragment>
            <TextField
              size="small"
              id="outlined-basic"
              label="Тип значения"
              type="number"
              variant="outlined"
              helperText="Пожалуйста введите значение"
              disabled
              select
              value={sourceType}
            >
              {[
                { label: 'Значение', value: 'number' },
                { label: 'Булевое значение', value: 'boolean' },
              ].map((item) => (
                <MenuItem key={item.label} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </React.Fragment>
        </Grid>
        <Grid item>
          <Field name={`${formName}.data.${method}`}>
            {({ input }) => (
              <React.Fragment>
                <TextField
                  size="small"
                  id="outlined-basic"
                  label="Значение"
                  variant="outlined"
                  helperText="Пожалуйста введите значение"
                  onChange={(e) => {
                    input.onChange(e.target.value);
                  }}
                  select={sourceType === 'boolean'}
                  value={input.value}
                >
                  {[
                    { label: 'True', value: 'true' },
                    { label: 'False', value: 'false' },
                  ].map((item) => (
                    <MenuItem key={item.label} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </React.Fragment>
            )}
          </Field>
        </Grid>

        {fields.value.length > 0 && (
          <Grid item>
            <IconButton onClick={() => fields.pop()}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

const initData = {
  name: '',
  settings: {
    delay: 0,
  },
  conditions: [],
  actions: [],
};

const AutoScriptForm = ({
  devices,
  scenario,
  methodTyping,
}: {
  devices: any[];
  methodTyping: any;
  scenario: any;
}) => {
  const addNew = () => ({
    uuid: uuid.v4(),
    uuidDevice: uuid.v4(),
    comparer: '=',
    value: {
      type: 'bool',
      value: true,
    },
    path: 'data.voltage.tmp2',
  });

  const adddNewAction = () => ({
    uuid: uuid.v4(),
    uuidDevice: uuid.v4(),
    method: '',
  });
  const classes = useStyles();
  const history = useHistory();

  return (
    <Form
      onSubmit={(data) => {
        if (methodTyping === 'new') {
          axios.post(endpoints.script.create, data).then(() => {
            history.push('/dashboard/scripts');
            console.log('ok');
          });
        } else {
          axios.put(endpoints.script.create + methodTyping).then(() => {
            history.push('/dashboard/scripts');
            console.log('ok');
          });
        }
      }}
      mutators={{
        // potentially other mutators could be merged here
        ...arrayMutators,
      }}
      initialValues={scenario}
      render={({ handleSubmit, pristine, invalid }) => (
        <form onSubmit={handleSubmit}>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Grid container spacing={4}>
                <Grid item>
                  <Field name={`name`}>
                    {({ input }) => (
                      <TextField
                        id="outlined-basic"
                        label="Наименование сценария"
                        size="small"
                        variant="outlined"
                        {...input}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item>
                  <Field name={`settings.delay`}>
                    {({ input }) => (
                      <TextField
                        size="small"
                        id="outlined-basic"
                        label="Заддержка сценария"
                        variant="outlined"
                        {...input}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item>
                  <Button size="large" type="submit">
                    Сохранить
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>Условия</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FieldArray name="conditions">
                    {({ fields }) => {
                      return (
                        <div>
                          {fields.map((name, index) => (
                            <AutoScriptCondition
                              devices={devices}
                              formName={name}
                              isSetValue={false}
                              fields={fields}
                              title="Если"
                            />
                          ))}
                          <br />
                          <Button
                            type="button"
                            variant="outlined"
                            onClick={() => fields.push(addNew())}
                          >
                            Добавить условие
                          </Button>
                        </div>
                      );
                    }}
                  </FieldArray>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography className={classes.heading}>Действия</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FieldArray name="actions">
                    {({ fields }) => (
                      <div>
                        {fields.map((name, index) => (
                          <AutoScriptSetValue
                            devices={devices}
                            formName={name}
                            isSetValue={true}
                            fields={fields}
                            scenario={_.get(scenario, `actions.${index}`)}
                            title="Действие"
                          />
                        ))}
                        <br />

                        <Button
                          type="button"
                          variant="outlined"
                          onClick={() => fields.push(adddNewAction())}
                        >
                          Добавить действие
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item></Grid>
            <Grid item></Grid>
          </Grid>

          <br />
        </form>
      )}
    />
  );
};

function AutoScriptEditor() {
  const [widgets, setWidgets] = React.useState<any[]>([]);
  const [scenario, setScenario] = React.useState(null);
  const { uuid } = useParams<any>();
  React.useEffect(() => {
    axios.get(endpoints.devices.list).then((res) => {
      setWidgets(res.data);
    });
    if (uuid === 'new') {
      setScenario(initData);
    } else
      axios.get(endpoints.script.getById(uuid)).then((res) => {
        setScenario(res.data);
      });
  }, []);

  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <Typography variant="h5" gutterBottom>
          Редактор сценариев
        </Typography>
      </Grid>

      <Grid item>
        <AutoScriptForm
          methodTyping={uuid}
          scenario={scenario}
          devices={widgets}
        />
      </Grid>
    </Grid>
  );
}

export default AutoScriptEditor;
