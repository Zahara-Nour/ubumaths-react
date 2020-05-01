import React, { useState, useRef, useEffect } from 'react'

import { saveBasket } from 'features/mental/mentalSlice'

// db ccess

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import Slide from '@material-ui/core/Slide'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
// @material-ui/icons
import Close from '@material-ui/icons/Close'
// core components
import Button from 'components/CustomButtons/Button.js'
import { grayColor } from 'assets/jss/main-jss'

import modalStyle from 'assets/jss/modalStyle.js'
import radioStyle from 'assets/jss/customCheckboxRadioSwitch.js'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectSaving,
  selectSaved,
  selectSaveError,
  selectFetched,
  saveReset,
  FETCH_STUDENTS,
} from 'features/db/dbSlice'

import {
  FormControl,
  FormControlLabel,
  TextField,
  Divider,
  CircularProgress,
  Checkbox,
} from '@material-ui/core'
import ChooseClasses from './ChooseClasses'
import ChooseStudents from './ChooseStudents'
import AssessmentsList from './AssessmentsList'
import SnackbarContent from 'components/Snackbar/SnackbarContent'
import { selectUser } from 'features/auth/authSlice'
import { useStudents } from 'app/hooks'

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

export default function ModalSave({ questions }) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [modal, setModal] = useState(false)
  const classeNames = useStyles()
  const [title, setTitle] = useState('')
  const [radioValue, setRadioValue] = useState('Modèle')
  const [titleExists, setTitleExists] = useState(false)
  const titles = useRef([])
  const saving = useSelector(selectSaving)
  const saved = useSelector(selectSaved)
  const saveError = useSelector(selectSaveError)
  const students = useStudents()[0]
  const [selectedClasses, setSelectedClasses] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])
  const [allSelectedStudents, setAllSelectedStudents] = useState([])
  const [oneShot, setOneShot] = useState(false)

  const classes = user.classes

  useEffect(() => setTitleExists(titles.current.includes(title)), [
    title,
    radioValue,
  ])

  useEffect(() => {
    if (students) {
      let allSelected = []
      selectedClasses.forEach((c) => {
        allSelected = allSelected.concat(students[c])
      })

      selectedStudents.forEach((student) => {
        if (!allSelected.includes(student)) {
          allSelected.push(student)
        }
      })

      setAllSelectedStudents(allSelected)
    }
  }, [students, selectedClasses, selectedStudents])

  const radioOnChange = (evt) => setRadioValue(evt.target.value)
  const handleChangeOneShot = () => setOneShot(c => !c)

  return (
    <div>
      <Button
        style={{
          backgroundColor: grayColor[3],
        }}
        onClick={() => setModal(true)}
      >
        Enregistrer
      </Button>
      <Dialog
        classes={{
          root: classeNames.modalRoot,
          paper: classeNames.modal,
        }}
        open={modal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          dispatch(saveReset())
          setModal(false)
        }}
        aria-labelledby='classic-modal-slide-title'
        aria-describedby='classic-modal-slide-description'
      >
        <DialogTitle
          id='classic-modal-slide-title'
          disableTypography
          className={classeNames.modalHeader}
        >
          <Button
            simple
            className={classeNames.modalCloseButton}
            key='close'
            aria-label='Close'
            onClick={() => {
              dispatch(saveReset())
              setModal(false)
            }}
          >
            {' '}
            <Close className={classeNames.modalClose} />
          </Button>
          <h4 className={classeNames.modalTitle}>Enregistrement</h4>
        </DialogTitle>
        <DialogContent
          id='classic-modal-slide-description'
          className={classeNames.modalBody}
        >
          {saved && (
            <SnackbarContent
              message={'enregistrement réussi !'}
              close
              color='success'
              onClose={() => dispatch(saveReset())}
            />
          )}
          {saveError && (
            <SnackbarContent
              message={"L'enregistrement à échoué ! " + saveError}
              close
              color='danger'
              onClose={() => dispatch(saveReset())}
            />
          )}

          <TextField
            error={title === '' || titleExists}
            fullWidth
            id='title'
            label={titleExists ? 'Enregistrement existant !' : 'Titre'}
            value={title}
            onChange={(evt) => {
              setTitle(evt.target.value)
            }}
          />

          <FormControl
            component='fieldset'
            style={{ marginTop: '1em', marginBottom: '1em' }}
          >
            <RadioGroup
              className={classeNames.flexContainerRow}
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

          {radioValue === 'Evaluation' && (
            <div
              className={classeNames.flexContainerRow}
              style={{
                marginTop: '2em',
                marginBottom: '2em',
                alignItems: 'flex-start',
              }}
            >
              
              <FormControl
                component='fieldset'
                className={classes.formControl}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={oneShot}
                      onChange={handleChangeOneShot}
                      name={'One Shot'}
                    />
                  }
                  label='one shot !'
                />
              </FormControl>
              <div>
              <ChooseClasses
                style={{ marginRight: '8em' }}
                classes={classes}
                selected={selectedClasses}
                onChange={setSelectedClasses}
              />

              {students ? (
                <ChooseStudents
                  students={classes.reduce(
                    (prev, current) =>
                      selectedClasses.includes(current)
                        ? prev
                        : { ...prev, [current]: students[current] },

                    {},
                  )}
                  selected={selectedStudents}
                  selectedClasses={selectedClasses}
                  onChange={setSelectedStudents}
                />
              ) : (
                <CircularProgress />
              )}
              </div>
            </div>
          )}
          <Divider />
          <AssessmentsList
            type={radioValue}
            onSelect={setTitle}
            onLoad={(t) => (titles.current = t)}
            selected={title}
            saved={saved}
          />
        </DialogContent>

        <DialogActions className={classeNames.modalFooter}>
          <Button
            onClick={() => {
              dispatch(saveReset())
              setModal(false)
            }}
            
          >
            Fermer
          </Button>
          <Button
            disabled={saving || !title}
            color='info'
            onClick={() => {
              dispatch(
                saveBasket(
                  user,
                  questions,
                  title,
                  radioValue,
                  oneShot,
                  allSelectedStudents,
                ),
              )
            }}
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
