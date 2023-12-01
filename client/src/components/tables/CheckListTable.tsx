import { Box, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { IChecklist } from '../../types/checklist.types'
import { Add, Delete, Edit, RemoveRedEye } from '@mui/icons-material'
import { ChoiceContext, CheckListChoiceActions } from '../../contexts/dialogContext'
import EditCheckListDialog from '../dialogs/checklists/EditCheckListDialog'
import DeleteCheckListDialog from '../dialogs/checklists/DeleteCheckListDialog'
import AddCheckBoxesDialog from '../dialogs/checklists/AddCheckBoxesDialog'
import ViewCheckListBoxesDialog from '../dialogs/checklists/ViewCheckListBoxesDialog'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'



type Props = {
    checklist: IChecklist | undefined
    setCheckList: React.Dispatch<React.SetStateAction<IChecklist | undefined>>,
    checklists: IChecklist[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedCheckLists: IChecklist[]
    setSelectedCheckLists: React.Dispatch<React.SetStateAction<IChecklist[]>>,
    dates: {
        start_date?: string | undefined;
        end_date?: string | undefined;
    } | undefined
}

function CheckListTable({ checklist, checklists, dates, setCheckList, selectAll, setSelectAll, selectedCheckLists, setSelectedCheckLists }: Props) {
    const [data, setData] = useState<IChecklist[]>(checklists)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        setData(checklists)
    }, [checklists])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                minHeight: '53.5vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >

                                <FormControlLabel sx={{ fontSize: 12 }} control={
                                    <Checkbox
                                        indeterminate={selectAll ? true : false}
                                        checked={Boolean(selectAll)}
                                        size="small" onChange={(e) => {
                                            if (e.currentTarget.checked) {
                                                setSelectedCheckLists(checklists)
                                                setSelectAll(true)
                                            }
                                            if (!e.currentTarget.checked) {
                                                setSelectedCheckLists([])
                                                setSelectAll(false)
                                            }
                                        }} />}
                                    label=""
                                />

                            </STableHeadCell>

                            {/* actions popup */}
                            {user?.checklists_access_fields.is_editable && <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>}


                            <STableHeadCell
                            >

                                CheckList Title

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Person

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Status

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Last Date

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Created At

                            </STableHeadCell>

                            {/* updated at */}

                            <STableHeadCell
                            >

                                Updated At

                            </STableHeadCell>

                            {/* created by */}

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

                            data && data.map((checklist, index) => {
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
                                            null}
                                        {!selectAll ?

                                            <STableCell>

                                                <Checkbox size="small"
                                                    onChange={(e) => {
                                                        setCheckList(checklist)
                                                        if (e.target.checked) {
                                                            setSelectedCheckLists([...selectedCheckLists, checklist])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedCheckLists((checklists) => checklists.filter((item) => {
                                                                return item._id !== checklist._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null/* actions popup */}
                                        {user?.checklists_access_fields.is_editable &&
                                            <STableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row" spacing={1}>
                                                            {

                                                                <>
                                                                    <Tooltip title="Edit">
                                                                        <IconButton color="info"
                                                                            onClick={() => {
                                                                                setChoice({ type: CheckListChoiceActions.edit_checklist })
                                                                                setCheckList(checklist)
                                                                            }}
                                                                        >
                                                                            <Edit />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Add More">
                                                                        <IconButton color="info"
                                                                            onClick={() => {
                                                                                setChoice({ type: CheckListChoiceActions.add_more_check_boxes })
                                                                                setCheckList(checklist)
                                                                            }}
                                                                        >
                                                                            <Add />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                    <Tooltip title="Delete">
                                                                        <IconButton color="error"
                                                                            onClick={() => {
                                                                                setChoice({ type: CheckListChoiceActions.delete_checklist })
                                                                                setCheckList(checklist)
                                                                            }}
                                                                        >
                                                                            <Delete />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="View">
                                                                        <IconButton color="success"
                                                                            onClick={() => {
                                                                                setChoice({ type: CheckListChoiceActions.view_checklist_boxes })
                                                                                setCheckList(checklist)
                                                                            }}
                                                                        >
                                                                            <RemoveRedEye />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                </>

                                                            }

                                                        </Stack>} />
                                            </STableCell>}


                                        <STableCell>
                                          

                                            <a href={checklist.sheet_url} target='blank'>
                                                {checklist.title && checklist.title.slice(0, 50)}
                                            </a>

                                        </STableCell>
                                        <STableCell>
                                        {checklist.owner.username}
                                        </STableCell>

                                        <STableCell>
                                            Checked : {checklist.boxes.filter((box) => {
                                                return box.desired_date && box.actual_date && new Date(box.desired_date) <= new Date()
                                            }).length}/{checklist.boxes.filter((box) => {
                                                return box.desired_date && new Date(box.desired_date) <= new Date()
                                            }).length}

                                        </STableCell>

                                        <STableCell>
                                           {checklist.boxes.length > 0 && new Date(checklist.boxes[checklist.boxes.length - 1].desired_date).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                           {new Date(checklist.created_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell>
                                           {new Date(checklist.updated_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell>
                                           {checklist.created_by.username}

                                        </STableCell>
                                        <STableCell>
                                           {checklist.updated_by.username}

                                        </STableCell>

                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >
            {
                checklist ?
                    <>
                        <EditCheckListDialog checklist={checklist} />
                        <DeleteCheckListDialog checklist={checklist} />
                        <AddCheckBoxesDialog checklist={checklist} />
                        <ViewCheckListBoxesDialog dates={dates} checklist={checklist} />
                    </>
                    : null
            }
        </>
    )
}

export default CheckListTable