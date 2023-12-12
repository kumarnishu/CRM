import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { Chat, Check, Comment, Edit, RemoveRedEye } from '@mui/icons-material'
import { ChoiceContext, VisitChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { IVisitReport } from '../../types/visit.types'
import EditSummaryInDialog from '../dialogs/visit/EditSummaryDialog'
import ValidateVisitDialog from '../dialogs/visit/ValidateVisitDialog'
import AddAnkitInputDialog from '../dialogs/visit/AddAnkitInputDialog'
import AddBrijeshInputDialog from '../dialogs/visit/AddBrjeshInputDialog'
import ViewVisitDialog from '../dialogs/visit/ViewVisitDialog'
import ViewCommentsDialog from '../dialogs/visit/ViewCommentsDialog'
import { DownloadFile } from '../../utils/DownloadFile'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'



type Props = {
    visit: IVisitReport | undefined
    setVisit: React.Dispatch<React.SetStateAction<IVisitReport | undefined>>,
    visits: IVisitReport[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedVisits: IVisitReport[]
    setSelectedVisits: React.Dispatch<React.SetStateAction<IVisitReport[]>>,
}

function VisitSTable({ visit, visits, setVisit, selectAll, setSelectAll, selectedVisits, setSelectedVisits }: Props) {
    const [data, setData] = useState<IVisitReport[]>(visits)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        setData(visits)
    }, [visits])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '60vh'
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
                                            setSelectedVisits(visits)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedVisits([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Date

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Visit in Photo

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Visit In

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Visit Out

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Party

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Station

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Salesman

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Visit In Address

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Is Old ?

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Turnover

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Dealer Of

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                References taken

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Reviews Taken

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Summary

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Ankit Input

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Brijesh Input

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Created at

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Updated at

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

                            data && data.map((visit, index) => {
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
                                                        setVisit(visit)
                                                        if (e.target.checked) {
                                                            setSelectedVisits([...selectedVisits, visit])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedVisits((visits) => visits.filter((item) => {
                                                                return item._id !== visit._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null}
                                        <STableCell style={{ backgroundColor: Boolean(!visit.visit_validated) ? 'rgba(255,0,0,0.1)' : 'rgba(52, 200, 84, 0.6)' }}>
                                            <PopUp
                                                element={
                                                    <Stack
                                                        direction="row" spacing={1}>
                                                        {
                                                            <>
                                                                <Tooltip title="Visit Details ">
                                                                    <IconButton color="success"
                                                                        onClick={() => {
                                                                            setChoice({ type: VisitChoiceActions.view_visit })
                                                                            setVisit(visit)
                                                                        }}
                                                                    >
                                                                        <RemoveRedEye />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="View Comments ">
                                                                    <IconButton color="success"
                                                                        onClick={() => {
                                                                            setChoice({ type: VisitChoiceActions.view_comments })
                                                                            setVisit(visit)
                                                                        }}
                                                                    >
                                                                        <Chat />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                {!visit.visit_validated && user?.visit_access_fields.is_editable && <Tooltip title="validate">
                                                                    <IconButton color="error"
                                                                        onClick={() => {
                                                                            setChoice({ type: VisitChoiceActions.validate_visit })
                                                                            setVisit(visit)
                                                                        }}
                                                                    >
                                                                        <Check />
                                                                    </IconButton>
                                                                </Tooltip>}
                                                                {user?.visit_access_fields.is_editable && <Tooltip title="Edit Summary">
                                                                    <IconButton color="success"
                                                                        onClick={() => {
                                                                            setChoice({ type: VisitChoiceActions.edit_summary })
                                                                            setVisit(visit)
                                                                        }}
                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>}
                                                                {user?.visit_access_fields.is_editable &&
                                                                    <Tooltip title="ankit input">
                                                                        <IconButton color="primary"
                                                                            onClick={() => {
                                                                                setChoice({ type: VisitChoiceActions.add_ankit_input })
                                                                                setVisit(visit)
                                                                            }}
                                                                        >
                                                                            <Comment />
                                                                        </IconButton>
                                                                    </Tooltip>}
                                                                {user?.reports_access_fields.is_editable &&
                                                                    <Tooltip title="brijesh input">
                                                                        <IconButton color="primary"
                                                                            onClick={() => {
                                                                                setChoice({ type: VisitChoiceActions.add_brijesh_input })
                                                                                setVisit(visit)
                                                                            }}
                                                                        >
                                                                            <Comment />
                                                                        </IconButton>
                                                                    </Tooltip>}
                                                            </>

                                                        }

                                                    </Stack>
                                                }


                                            />
                                        </STableCell>





                                        <STableCell>
                                            {new Date(visit.visit.start_day_credientials && visit.visit.start_day_credientials.timestamp).toLocaleDateString()}
                                        </STableCell>

                                        <STableCell>

                                            {visit.visit_in_photo && <img
                                                title="double click to download"
                                                onDoubleClick={() => {
                                                    if (visit.visit_in_photo && visit.visit_in_photo?.public_url) {
                                                        DownloadFile(visit.visit_in_photo?.public_url, visit.visit_in_photo?.filename)
                                                    }
                                                }}
                                                src={visit.visit_in_photo?.public_url} style={{ borderRadius: '5px', width: '30px', height: '30px' }} />}

                                        </STableCell>
                                        <STableCell>
                                            {new Date(visit.visit_in_credientials && visit.visit_in_credientials.timestamp).toLocaleTimeString()}
                                        </STableCell>

                                        <STableCell>
                                            {visit.visit_out_credentials && visit.visit_out_credentials.timestamp && new Date(visit.visit_out_credentials.timestamp).toLocaleTimeString()}
                                        </STableCell>
                                        <STableCell>
                                            {visit.party_name}
                                        </STableCell>
                                        <STableCell>
                                            {visit.city}
                                        </STableCell>
                                        <STableCell>
                                            {visit.person.username}
                                        </STableCell>
                                        <STableCell>
                                            {visit.visit_in_credientials && visit.visit_in_credientials.address && visit.visit_in_credientials.address}
                                        </STableCell>
                                        <STableCell>
                                            {visit.is_old_party ? "Old " : "New "}
                                        </STableCell>
                                        <STableCell>
                                            {visit.turnover}
                                        </STableCell>
                                        <STableCell>
                                            {visit.dealer_of}
                                        </STableCell>
                                        <STableCell>
                                            {visit.refs_given}
                                        </STableCell>
                                        <STableCell>
                                            {visit.reviews_taken}
                                        </STableCell>
                                        <STableCell>
                                            {visit.summary && visit.summary.slice(0, 50) + "..."}
                                        </STableCell>
                                        <STableCell>
                                            {visit.ankit_input && visit.ankit_input.input.slice(0, 50) + "..."}
                                        </STableCell>

                                        <STableCell>
                                            {visit.brijesh_input && visit.brijesh_input.input.slice(0, 50) + "..."}
                                        </STableCell>

                                        <STableCell>
                                            {new Date(visit.created_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {new Date(visit.updated_at).toLocaleString()}
                                        </STableCell>
                                        <STableCell>
                                            {visit.created_by.username}
                                        </STableCell>
                                        <STableCell>
                                            {visit.updated_by.username}
                                        </STableCell>

                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >
            {
                visit ?
                    <>
                        <ViewVisitDialog visit={visit} />
                        <ViewCommentsDialog visit={visit} />
                        <ValidateVisitDialog visit={visit} />
                        <EditSummaryInDialog visit={visit} />
                        <AddBrijeshInputDialog visit={visit} />
                        <AddAnkitInputDialog visit={visit} />
                    </>
                    : null
            }
        </>
    )
}

export default VisitSTable