import { Button, LinearProgress, Paper, Stack, Typography } from "@mui/material"
import NewProductionDialog from "../../components/dialogs/production/CreateProductionDialog"
import { useContext } from "react"
import { ChoiceContext, ProductionChoiceActions } from "../../contexts/dialogContext"
import { BackendError } from "../.."
import { IProduction } from "../../types/production.types"
import { AxiosResponse } from "axios"
import { useQuery } from "react-query"
import { GetMyProductions } from "../../services/ProductionServices"
import moment from "moment"

function MyProductionPage() {
  const { setChoice } = useContext(ChoiceContext)
  const { data, isLoading } = useQuery<AxiosResponse<IProduction[]>, BackendError>("productions", GetMyProductions)
  return (
    <>
      {isLoading && <LinearProgress />}
      <Stack direction={'column'} justifyContent={'center'}>
        <Typography variant="h6" sx={{ fontSize: '18', textAlign: 'center' }}>Daily Productions</Typography>
        {data && data?.data.length !== 3 && <Stack sx={{ justifyContent: 'center' }}>
          < Button variant="outlined" disabled={isLoading} size="large" sx={{ mx: 8, my: 2, fontWeight: 'bold', fontSize: 12 }} color="info"
            onClick={() => { setChoice({ type: ProductionChoiceActions.create_production }) }}
          >+ Create Production</Button>
        </Stack >}
        <Stack sx={{ p: 1 }}>
          {data && data.data.map((production, index) => {
            return (
              <Paper key={index} elevation={8} sx={{ p: 2, wordSpacing: 2, m: 2, boxShadow: 3, backgroundColor: 'white', borderRadius: 2 }}>
                <Stack
                  direction="column"
                  gap={2}
                >
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    Machine : {production.machine.name}
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    Article : {production.article.name}
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    Thekedar :  <span style={{ fontWeight: 'bold', color: 'grey' }}> {production.thekedar.username}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    Production : <span style={{ fontWeight: 'bold', color: 'green', fontSize: 14 }}> {production.production}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    Small Repair : <span style={{ fontWeight: 'bold', color: 'grey' }}> {production.small_repair}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    Big Repair : <span style={{ fontWeight: 'bold', color: 'red', fontSize: 14 }}> {production.big_repair}</span>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize', fontSize: 12 }}>
                    Created By :<b>{production.created_by.username}</b>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize', color: 'grey', }}>
                    <b>{moment(new Date(production.created_at)).calendar()}</b>
                  </Typography>

                </Stack>
              </Paper>
            )
          })}
        </Stack >
      </Stack>
      <NewProductionDialog />
    </>

  )
}

export default MyProductionPage