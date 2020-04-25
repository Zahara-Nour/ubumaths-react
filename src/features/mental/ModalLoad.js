import React, { useState } from 'react'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import Slide from '@material-ui/core/Slide'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
// @material-ui/icons
import Close from '@material-ui/icons/Close'
// core components
import Button from 'components/CustomButtons/Button.js'

import modalStyle from 'assets/jss/modalStyle.js'
import radioStyle from 'assets/jss/customCheckboxRadioSwitch.js'
import {grayColor} from 'assets/jss/main-jss'

import { useDispatch, useSelector } from 'react-redux'
import {
  selectFetched,
  selectFetching,
  selectFetchError,
  fetchReset,
  FETCH_ASSESSMENT,
  selectSaved,
} from 'features/db/dbSlice'
import { loadBasket } from './mentalSlice'
import {
  CircularProgress,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core'
import AssessmentsList from './AssessmentsList'
import SnackbarContent from 'components/Snackbar/SnackbarContent'
import { selectUser } from 'features/auth/authSlice'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />
})

const flexContainerColumn = {
  display: 'flex',
  flexDirection: 'column',
}

const flexContainerRow = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}

const useStyles = makeStyles({
  ...modalStyle,
  ...radioStyle,
  flexContainerColumn,
  flexContainerRow,
})

function ModalLoad() {
  const [modal, setModal] = useState(false)

  const dispatch = useDispatch()
  const [radioValue, setRadioValue] = useState('Modèle')

  const radioOnChange = (evt) => setRadioValue(evt.target.value)

  const fetched = useSelector(selectFetched(FETCH_ASSESSMENT))

  const fetching = useSelector(selectFetching(FETCH_ASSESSMENT))

  const fetchError = useSelector(selectFetchError(FETCH_ASSESSMENT))
  const classes = useStyles()
  const user = useSelector(selectUser)
  const saved = useSelector(selectSaved)

  const text = 'Charger'
  const [title, setTitle] = useState('')

  return (
    <div>
      <Button  style= {{ backgroundColor:grayColor[3]}}  onClick={() => setModal(true)}>
        {text}
      </Button>
      <Dialog
        classes={{
          root: classes.modalRoot,
          paper: classes.modal,
        }}
        open={modal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          dispatch(fetchReset({ type: FETCH_ASSESSMENT }))
          setModal(false)
        }}
        aria-labelledby='classic-modal-slide-title'
        aria-describedby='classic-modal-slide-description'
      >
        <DialogTitle
          id='classic-modal-slide-title'
          disableTypography
          className={classes.modalHeader}
        >
          <Button
            simple
            className={classes.modalCloseButton}
            key='close'
            aria-label='Close'
            onClick={() => {
              dispatch(fetchReset({ type: FETCH_ASSESSMENT }))
              setModal(false)
            }}
          >
            {' '}
            <Close className={classes.modalClose} />
          </Button>
          <h4 className={classes.modalTitle}>{text}</h4>
        </DialogTitle>
        <DialogContent
          id='classic-modal-slide-description'
          className={classes.modalBody}
        >
          {fetched && (
            <SnackbarContent
              message={'Chargement réussi !'}
              close
              color='success'
              onClose={() => {
                dispatch(fetchReset({ type: FETCH_ASSESSMENT }))
              }}
            />
          )}
          {fetchError && (
            <SnackbarContent
              message={'Le chargement a échoué ! ' + fetchError}
              close
              color='danger'
              onClose={() => dispatch(fetchReset({ type: FETCH_ASSESSMENT }))}
            />
          )}
          {fetching === 'Assessment' && <CircularProgress />}

          <FormControl component='fieldset'>
            <RadioGroup
              className={classes.flexContainerRow}
              aria-label='type'
              name='type'
              value={radioValue}
              onChange={radioOnChange}
            >
              {user.admin && (
                <FormControlLabel
                  value='Modèle global'
                  control={<Radio />}
                  label='Modèle global'
                />
              )}
              <FormControlLabel
                value='Modèle'
                control={<Radio />}
                label='Modèle'
              />
              <FormControlLabel
                value='Evaluation'
                control={<Radio />}
                label='Evaluation'
              />
            </RadioGroup>
          </FormControl>

          <AssessmentsList
            type={radioValue}
            onSelect={setTitle}
            selected={title}
            saved={saved}
          />
        </DialogContent>
        <DialogActions className={classes.modalFooter}>
          <Button
            onClick={() => {
              dispatch(fetchReset({ type: FETCH_ASSESSMENT }))
              setModal(false)
            }}
          >
            Close
          </Button>
          <Button
            disabled={!!fetching || !title}
            color='primary'
            onClick={() => {
              dispatch(loadBasket(user.email, title, radioValue))
            }}
          >
            {text}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
export default ModalLoad
