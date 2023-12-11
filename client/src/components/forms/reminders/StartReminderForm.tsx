import { Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, ReminderChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { StartReminder } from '../../../services/ReminderServices';
import moment from 'moment'
import AlertBar from '../../snacks/AlertBar';
import { IReminder } from '../../../types/reminder.types';
import { IUser } from '../../../types/user.types';


type TformData = {
  client_id?: string,
  frequency_value: string,
  frequency_type: string,
  start_date: string,
  is_random_template: boolean
  is_todo: boolean
  run_once: boolean
}

function StartReminderForm({ reminder, users, client }: { reminder: IReminder, users: IUser[], client?: string }) {
  const { mutate, isLoading, isSuccess, isError, error } = useMutation
    <AxiosResponse<IUser>, BackendError, { id: string, body: FormData }>
    (StartReminder, {
      onSuccess: () => {
        queryClient.invalidateQueries('reminders')
      }
    })

  const { setChoice } = useContext(ChoiceContext)

  const formik = useFormik<TformData>({
    initialValues: {
      client_id: client,
      frequency_value: reminder.frequency_value || "1",
      frequency_type: reminder.frequency_type || "days",
      start_date: moment(reminder.start_date).format("YYYY-MM-DDThh:mm"),
      is_random_template: Boolean(reminder.is_random_template),
      is_todo: Boolean(reminder.is_todo),
      run_once: Boolean(reminder.run_once),
    },
    validationSchema: Yup.object({
      client_id: Yup.string()
        .required('Required field'),
      frequency_value: Yup.string()
        .required('Required field'),
      is_random_template: Yup.boolean()
        .required('Required field'),
      start_date: Yup.string().required('Required field'),
      frequency_type: Yup.string()
        .required('Required field')
    }),
    onSubmit: (values: TformData) => {
      let formdata = new FormData()
      formdata.append("body", JSON.stringify(values))
      mutate({ id: reminder._id, body: formdata })
    }
  });

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setChoice({ type: ReminderChoiceActions.close_reminder })
      }, 1000)
    }
  }, [isSuccess, setChoice])
  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack sx={{ direction: { xs: 'column', md: 'row' } }}>
        <Stack
          direction="column"
          gap={2}
          sx={{ p: 1 }}
        >
          <TextField
            fullWidth
            required
            select
            SelectProps={{
              native: true
            }}
            error={
              formik.touched.client_id && formik.errors.client_id ? true : false
            }
            id="whatsapp_users"
            label="Whatsapp Users"
            helperText={
              formik.touched.client_id && formik.errors.client_id ? formik.errors.client_id : "Selct your whatsapp number from which you have to send message"
            }
            {...formik.getFieldProps('client_id')}
          >
            <option value={undefined}>
            </option>
            {
              users && users.map(user => {
                return (
                  <React.Fragment key={user._id}>
                    {user.connected_number && <option value={user.client_id}>
                      {`${user.username} :: ${user.connected_number.replace("91", "").replace("@c.us", "")}`}
                    </option>}
                  </React.Fragment>
                )
              })
            }
          </TextField>

          < TextField
            type="datetime-local"

            error={
              formik.touched.start_date && formik.errors.start_date ? true : false
            }
            id="start_date"
            label="Start Date&Time"
            fullWidth
            required
            helperText={
              formik.touched.start_date && formik.errors.start_date ? formik.errors.start_date : "select date and time to send messasge after that"
            }
            {...formik.getFieldProps('start_date')}
          />

          <FormGroup title={"select to send one random template from selected templates otherwise all selected templates will be sent"}>
            <FormControlLabel control={<Checkbox

              checked={Boolean(formik.values.is_random_template)}
              {...formik.getFieldProps('is_random_template')}
            />} label="Random template" />
          </FormGroup>
          <FormGroup>
            <FormControlLabel title={"select to make it a todo that will be stopped by (STOP-ID), until next refresh time"} control={<Checkbox
              checked={Boolean(formik.values.is_todo)}
              {...formik.getFieldProps('is_todo')}
            />} label="Is TODO" />
          </FormGroup>
          <FormGroup title={"select to send only one message after that it will be stopped"}>
            <FormControlLabel control={<Checkbox
              checked={Boolean(formik.values.run_once)}
              {...formik.getFieldProps('run_once')}
            />} label="Run Once" />
          </FormGroup>

          <TextField
            fullWidth
            select
            SelectProps={{
              native: true
            }}
            required
            error={
              formik.touched.frequency_type && formik.errors.frequency_type ? true : false
            }
            id="frequency_type"
            label="Frequency Type"
            helperText={
              formik.touched.frequency_type && formik.errors.frequency_type ? formik.errors.frequency_type : "month,hours and minutes will be choosen from start date and time"
            }
            {...formik.getFieldProps('frequency_type')}
          >

            <option value={undefined}>
            </option>
            <option value="minutes">
              minutes
            </option>
            <option value="hours">
              hours
            </option>
            <option value="days">
              days
            </option>
            <option value="months">
              months
            </option>
            <option value="weekdays">
              weekdays
            </option>
            <option value="monthdays">
              monthdays
            </option>
            <option value="yeardays">
              yeardays
            </option>
          </TextField>


          <TextField
            fullWidth
            required
            error={
              formik.touched.frequency_value && formik.errors.frequency_value ? true : false
            }
            id="frequency_value"
            label="Frequency"
            helperText={
              formik.touched.frequency_value && formik.errors.frequency_value ? formik.errors.frequency_value : "for weekday, monthdays and yeardays use comma seperator"
            }
            {...formik.getFieldProps('frequency_value')}
          />

          {
            isError ? (
              <AlertBar message={error?.response.data.message} color="error" />
            ) : null
          }
          {
            isSuccess ? (
              <AlertBar message="new template reminder started" color="success" />
            ) : null
          }
          <Button variant="contained" color="primary" type="submit"
            disabled={Boolean(isLoading)}
            fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Activate"}
          </Button>
        </Stack>
      </Stack>
    </form >
  )
}

export default StartReminderForm
