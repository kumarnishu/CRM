import { Block, Chat, Edit, HideImageRounded, Pause, Person3Outlined, RestartAlt, Stop } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ReminderChoiceActions, ChoiceContext, TemplateChoiceActions } from '../../contexts/dialogContext'
import UpdateReminderDialog from '../dialogs/reminders/UpdateReminderDialog'
import ViewReminderDialog from '../dialogs/reminders/ViewReminderDialog'
import StartReminderDialog from '../dialogs/reminders/StartReminderDialog'
import ResetReminderDialog from '../dialogs/reminders/ResetReminderDialog'
import StopReminderDialog from '../dialogs/reminders/StopReminderDialog'
import UpdateReminderMessageDialog from '../dialogs/reminders/UpdateReminderMessageDialog'
import StartReminderMessageDialog from '../dialogs/reminders/StartReminderMessageDialog'
import PopUp from '../popup/PopUp'
import { IReminder } from '../../types/reminder.types'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import HideReminderDialog from '../dialogs/reminders/HideReminderDialog.tsx'
import ViewTemplateDialog from '../dialogs/templates/ViewTemplateDialog.tsx'
import { Asset } from '../../types/asset.types.ts'


type Props = {
    reminder: IReminder | undefined,
    setReminder: React.Dispatch<React.SetStateAction<IReminder | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    reminders: IReminder[],
    selectedReminders: IReminder[]
    setSelectedReminders: React.Dispatch<React.SetStateAction<IReminder[]>>,
}
function RemindersSTable({ reminder, selectAll, reminders, setSelectAll, setReminder, selectedReminders, setSelectedReminders }: Props) {
    const [data, setData] = useState<IReminder[]>(reminders)
    const { setChoice } = useContext(ChoiceContext)
    const [template, setTemplate] = useState<{
        message?: string | undefined;
        caption?: string | undefined;
        media?: Asset;
    }>()
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (data)
            setData(reminders)
    }, [reminders, data])
    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '73vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >


                                <Checkbox
                                    indeterminate={selectAll ? true : false}
                                    checked={Boolean(selectAll)}
                                    size="small" onChange={(e) => {
                                        if (e.currentTarget.checked) {
                                            setSelectedReminders(reminders)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedReminders([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>
                            {user?.reminders_access_fields.is_editable &&
                                <STableHeadCell
                                >

                                    Actions

                                </STableHeadCell>}
                            <STableHeadCell
                            >

                                Serial no

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Reminder Name

                            </STableHeadCell>
                           
                            <STableHeadCell
                            >

                                Id

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Status

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Type

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Message Type

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Run Once

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Next Run Date

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Frequency Type

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Frequency

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Random Templates

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Connected Number

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Status Updated

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Created By

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Updated By

                            </STableHeadCell>
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            reminders && reminders.map((reminder, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >
                                        {selectAll ?
                                            <STableCell>


                                                <Checkbox size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell>

                                                <Checkbox size="small"
                                                    onChange={(e) => {
                                                        setReminder(reminder)
                                                        if (e.target.checked) {
                                                            setSelectedReminders([...selectedReminders, reminder])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedReminders((reminders) => reminders.filter((item) => {
                                                                return item._id !== reminder._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}

                                        <STableCell style={{ backgroundColor: reminder.is_hidden ? 'rgba(255,0,0,0.1)' : 'rgba(188, 209, 192, 0.6)' }}>
                                            <PopUp element={<Stack direction="row">
                                                {user?.reminders_access_fields.is_editable && <>
                                                    {
                                                        !reminder.is_active ?
                                                            <>
                                                                <Tooltip title="Start Reminder">
                                                                    <IconButton
                                                                        color="info"
                                                                        size="medium"
                                                                        onClick={() => {
                                                                            if (reminder.templates)
                                                                                setChoice({ type: ReminderChoiceActions.start_reminder })
                                                                            if (reminder.message)
                                                                                setChoice({ type: ReminderChoiceActions.start_message_reminder })
                                                                            setReminder(reminder)
                                                                        }}>
                                                                        <RestartAlt />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                            :
                                                            <Tooltip title="Stop">
                                                                <IconButton
                                                                    color="error"
                                                                    size="medium"
                                                                    onClick={() => {

                                                                        setChoice({ type: ReminderChoiceActions.stop_reminder })
                                                                        setReminder(reminder)
                                                                    }}>
                                                                    <Stop />
                                                                </IconButton>
                                                            </Tooltip>
                                                    }


                                                    <Tooltip title="Reset Reminder">
                                                        <IconButton
                                                            color="error"
                                                            size="medium"
                                                            onClick={() => {

                                                                setChoice({ type: ReminderChoiceActions.reset_reminder })
                                                                setReminder(reminder)
                                                            }}>
                                                            <Block />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Toogle Hidden Reminder">
                                                        <IconButton
                                                            color="warning"
                                                            size="medium"
                                                            onClick={() => {
                                                                setChoice({ type: ReminderChoiceActions.hide_reminder })
                                                                setReminder(reminder)
                                                            }}>
                                                            <HideImageRounded />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="edit">
                                                        <IconButton
                                                            color="success"
                                                            size="medium"
                                                            disabled={Boolean(reminder.is_active)}
                                                            onClick={() => {

                                                                if (reminder.templates)
                                                                    setChoice({ type: ReminderChoiceActions.update_reminder })
                                                                if (reminder.message)
                                                                    setChoice({ type: ReminderChoiceActions.update_message_reminder })
                                                                setReminder(reminder)
                                                            }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>}
                                                <Tooltip title="view message">
                                                    <IconButton
                                                        color="success"
                                                        size="medium"
                                                        onClick={() => {
                                                            if (reminder.message)
                                                                setTemplate({
                                                                    message: reminder.message.message,
                                                                    media: reminder.message.media,
                                                                    caption: reminder.message.caption
                                                                })
                                                            if (reminder.templates[0])
                                                                setTemplate({
                                                                    message: reminder.templates[0].message,
                                                                    media: reminder.templates[0].media,
                                                                    caption: reminder.templates[0].caption
                                                                })
                                                            setChoice({ type: TemplateChoiceActions.view_template })
                                                        }}>
                                                        <Chat />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="view recipients">
                                                    <IconButton
                                                        color="secondary"
                                                        size="medium"
                                                        onClick={() => {
                                                            setChoice({ type: ReminderChoiceActions.view_reminder })
                                                            setReminder(reminder)
                                                        }}>
                                                        <Person3Outlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>} />
                                        </STableCell>
                                        <STableCell>
                                            {reminder.index_num}
                                        </STableCell>

                                        <STableCell>
                                            {reminder.name}
                                        </STableCell>

                                        <STableCell>
                                            {reminder.serial_number || "not available"}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.is_active ?
                                                <>
                                                    {reminder.is_paused ? <Pause /> : <Stop />}
                                                </> :
                                                'Stopped'
                                            }
                                        </STableCell>
                                        <STableCell>
                                            {reminder.is_todo ? "todo" : "reminder"}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.message ? "message" : "template"}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.run_once ? "true" : "false"}
                                        </STableCell>


                                        <STableCell>
                                            {new Date(reminder.next_run_date).toLocaleString()}
                                        </STableCell>


                                        <STableCell>
                                            {reminder.frequency_type}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.frequency_value}
                                        </STableCell>

                                        <STableCell>
                                            {reminder.is_random_template ? "yes" : "No"}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.connected_number && reminder.connected_number.toString().replace("91", "").replace("@c.us", "")}
                                        </STableCell>

                                        <STableCell>
                                            {reminder.updated_at && new Date(reminder.updated_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {reminder.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
                {
                    reminder ?
                        <>
                            <UpdateReminderDialog reminder={reminder} />
                            <ViewReminderDialog reminder={reminder} />
                            <StartReminderDialog reminder={reminder} />
                            <ResetReminderDialog reminder={reminder} />
                            <StopReminderDialog reminder={reminder} />
                            <UpdateReminderMessageDialog reminder={reminder} />
                            <StartReminderMessageDialog reminder={reminder} />
                            <HideReminderDialog reminder={reminder} />
                        </> : null
                }
                {template && <ViewTemplateDialog template={template} />}
            </Box >
        </>
    )
}

export default RemindersSTable