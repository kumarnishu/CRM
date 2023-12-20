import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Stack, Button, CircularProgress, TextField } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { IUser } from '../../../types/user.types';
import { AxiosResponse } from 'axios';
import { useMutation, useQuery } from 'react-query';
import { BackendError } from '../../..';
import { AssignUsers, GetUsers } from '../../../services/UserServices';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { useFormik } from 'formik';
import * as Yup from "yup"


function AssignUsersDialog({ user }: { user: IUser }) {
    const [users, setUsers] = useState<IUser[]>([])
    const { data, isSuccess: isUserSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string,
            body: {
                ids: string[]
            }
        }>
        (AssignUsers, {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
            }
        })
    const formik = useFormik<{
        ids: string[]
    }>({
        initialValues: {
            ids: user.assigned_users.map((u) => { return u._id })
        },
        validationSchema: Yup.object({
            ids: Yup.array()
                .required('field')
        }),
        onSubmit: (values: {
            ids: string[]
        }) => {
            mutate({
                id: user._id,
                body: {
                    ids: values.ids
                }
            })
            queryClient.invalidateQueries('users')
        }
    });

    useEffect(() => {
        if (isUserSuccess)
            setUsers(data?.data)
    }, [isUserSuccess, data])


    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: UserChoiceActions.close_user })
            }, 1000)
        }
    }, [isSuccess, setChoice])

    return (
        <Dialog
            fullWidth
            open={choice === UserChoiceActions.assign_users ? true : false}
            onClose={() => {
                setChoice({ type: UserChoiceActions.close_user })
            }}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => { setChoice({ type: UserChoiceActions.close_user }) }}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Assign Users
            </DialogTitle>
            <DialogContent>
                <Stack
                    gap={2}
                    pt={2}
                >
                    <Typography variant="body1" color="error">
                        {`Warning ! This will assign ${formik.values.ids.length} users to the selected user.`}

                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                        < TextField
                            select
                            SelectProps={{
                                native: true,
                                multiple: true
                            }}
                            focused

                            error={
                                formik.touched.ids && formik.errors.ids ? true : false
                            }
                            id="ids"
                            label="Assign Users"
                            fullWidth
                            required
                            helperText={
                                formik.touched.ids && formik.errors.ids ? formik.errors.ids : ""
                            }
                            {...formik.getFieldProps('ids')}
                        >
                            {
                                users.map(user => {
                                    return (<option key={user._id} value={user._id}>
                                        {user.username}
                                    </option>)
                                })
                            }
                        </TextField>
                        <Button style={{padding:10,marginTop:10}} variant="contained" color="primary" type="submit"
                            disabled={Boolean(isLoading)}
                            fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Assign"}
                        </Button>
                    </form>


                </Stack>
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="assigned successfully" color="success" />
                    ) : null
                }
            </DialogContent>
        </Dialog >
    )
}

export default AssignUsersDialog