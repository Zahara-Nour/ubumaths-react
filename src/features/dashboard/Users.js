import React, { useState, useRef, useEffect } from 'react'
import db from 'app/db'
import styles from 'assets/jss/views/extendedTablesStyle.js'
import { makeStyles } from '@material-ui/core/styles'

// material-ui icons
import Assignment from '@material-ui/icons/Assignment'

// core components
import Table from 'components/Table/Table.js'
import Button from 'components/CustomButtons/Button.js'
import Card from 'components/Card/Card.js'
import CardBody from 'components/Card/CardBody.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardHeader from 'components/Card/CardHeader.js'
import { CircularProgress, List, ListItem } from '@material-ui/core'
import SnackbarContent from 'components/Snackbar/SnackbarContent'
import { useSelector } from 'react-redux'
import { selectUser } from 'features/auth/authSlice'

function Users() {
  const [pasted, setPasted] = useState(false)
  const [header, setHeader] = useState([])
  const [rows, setRows] = useState()
  const [enhancedRows, setEnhancedRows] = useState()
  const [goodFormat, setGoodFormat] = useState(true)
  const rejectedRef = useRef([])
  const [saving, setSaving] = useState(false)

  const [emails, setEmails] = useState()
  const [classes, setClasses] = useState()
  const [availableClasses, setAvailaibleClasses] = useState()
  const [existingStudents, setExistingStudents] = useState()
  const inputRef = useRef()
  const user = useSelector(selectUser)
  const errorsRef = useRef([])
  const [saved, setSaved] = useState(false)

  const format = {
    header: ['email', 'classe'],
    rows: [['zahara.nour@voltariedoha.com', '6B WestBay']],
  }
  const checkFormat = (header) => {
    if (format.header.length !== header.length) return false
    return !format.header.some(
      (name, index) => name !== header[index].toLowerCase(),
    )
  }

  // Set focus element receiving paste evenment
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  // fetch availableClasses
  useEffect(() => {
    db.collection('Users')
      .doc(user.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data()
          setAvailaibleClasses(data.classes)
        } else {
          const msg = `Impossible de retrouver les classes de ${user.email}`
          errorsRef.current.push(msg)
          setAvailaibleClasses(msg)
        }
      })

    const fetchedStudents = []
    db.collection('Users')
      .where('school', '==', user.school)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          fetchedStudents.push(doc.id)
        })
        setExistingStudents(fetchedStudents)
      })
      .catch(function (error) {
        const msg = `Impossible de retrouver les élèves de : ${user.school}`
        setExistingStudents(msg)
        errorsRef.current.push(msg)
      })
  }, [user.email, user.school])

  // prepare data from paste evenment for table
  const handlePaste = (e) => {
    e.preventDefault()
    if (!availableClasses || !existingStudents) return
    if (!e.clipboardData || !e.clipboardData.items) return
    const items = e.clipboardData.items

    let data
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'string' && items[i].type.match('^text/plain')) {
        data = items[i]
        break
      }
    }

    if (!data) return

    data.getAsString(function (text) {
      text = text.replace(/\r/g, '').trim('\n')
      const rowsOfText = text.split('\n')
      let header = []
      const rows = []
      rowsOfText.forEach(function (rowAsText) {
        // Remove wrapping double quotes
        const row = rowAsText.split('\t').map(function (colAsText) {
          return colAsText.trim().replace(/^"(.*)"$/, '$1')
        })
        // The first row containing data is assumed to be the header
        if (header.length === 0) {
          // Remove empty columns
          while (row.length && !row[row.length - 1].trim()) row.pop()
          if (row.length === 0) return
          header = row
        } else {
          rows.push(row.slice(0, header.length))
        }
      })

      if (!checkFormat(header)) {
        setGoodFormat(false)
        return
      }
      rejectedRef.current = []
      setGoodFormat(true)
      setHeader(header)
      setRows(rows)
      setEmails(rows.map((row) => row[0]))
      setClasses(rows.map((row) => row[1]))
      setPasted(true)
    })
  }

  // Check if students exist

  //  check if classes exist

  useEffect(() => {
    if (!rows || rows.length === 0 || !existingStudents || !availableClasses)
      return
    let newRows = rows.map((row, index) => {
      const email = row[0]
      const existed = existingStudents.includes(email)
      if (existed && !rejectedRef.current.includes(index))
        rejectedRef.current.push(index)
      return existed
        ? [<div style={{ color: 'red' }}>{email} existe déjà</div>, row[1]]
        : row
    })

    newRows = newRows.map((row, index) => {
      const className = row[1]
      const existed = availableClasses.includes(className)
      if (!existed && !rejectedRef.current.includes(index))
        rejectedRef.current.push(index)
      return existed
        ? row
        : [row[0], <div style={{ color: 'red' }}>{className} n'existe pas</div>]
    })

    setEnhancedRows(newRows)
  }, [rows, existingStudents, availableClasses])

  function addStudent(school, className, email) {
    const record = {
      school,
      class: className,
      role: 'student',
      email,
    }

    return db
      .collection('Users')
      .doc(email)
      .set(record)
      .then(
        console.log(
          '%c%s',
          'color: green',
          `Enregistrement de l'élève ${email} réussi`,
        ),
      )
      .catch((e) => {
        const msg = `Echec de l'enregistrement de l'élève ${email} : $e`
        errorsRef.current.push(msg)
        console.log('%c%s', 'color: red', msg)
      })
  }

  const text = (
    <p>
      Coller ici les cellules provenant d'une feuille de calcul Excel ou Google
      Sheet en respectant le format suivant :
    </p>
  )

  return (
    <div>
      {errorsRef.current.length > 0 &&
        errorsRef.current.map((error) => (
          <SnackbarContent message={error} close color='danger' />
        ))}
      
      {saved && (
        <SnackbarContent
          message={'Enregistrement réussi !'}
          close
          color='success'
        />
      )}
      
      Classes attitrées :
      {!availableClasses && <CircularProgress />}
      {Array.isArray(availableClasses) && (
        <List>
          {availableClasses.map((className, index) => (
            <ListItem key={index}>{availableClasses[index]}</ListItem>
          ))}
        </List>
      )}
      
      {pasted ? (
        enhancedRows ? (
          <div>
            <ExtendedTables header={header} rows={enhancedRows} />
            <Button
              color='rose'
              disabled={saving}
              onClick={() => {
                setSaved(false)
                setSaving(true)
                const promised = []
                console.log('rejected',rejectedRef.current)
                emails.forEach((email, index) => {
                  if (!rejectedRef.current.includes(index)) {
                    promised.push(
                      addStudent('Voltaire-Doha-Qatar', classes[index], email),
                    )
                  }
                })
                Promise.all(promised).then(() => {
                  setSaving(false)
                  setSaved(true)
                })
              }}
            >
              Ajouter
            </Button>
          </div>
        ) : (
          <CircularProgress />
        )
      ) : (
        <div>
          {!goodFormat && (
            <SnackbarContent
              message={<div>L'import n'est pas au bon format</div>}
              color='danger'
            />
          )}

          <ExtendedTables header={format.header} rows={format.rows}>
            <div onClick={() => inputRef.current.focus()}>
              <p>{text}</p>
            </div>
            <div ref={inputRef} contentEditable={true} onPaste={handlePaste} />
          </ExtendedTables>
        </div>
      )}
    </div>
  )
}

export default Users

const useStyles = makeStyles(styles)

function ExtendedTables(props) {
  const classes = useStyles()

  return (
    <Card>
      <CardHeader color='rose' icon>
        <CardIcon color='rose'>
          <Assignment />
        </CardIcon>
        <h4 className={classes.cardIconTitle}>Elèves à ajouter</h4>
      </CardHeader>
      <CardBody>
        {props.children}
        {props.header && props.rows ? (
          <Table
            tableHead={props.header}
            tableData={props.rows}
            customCellClasses={[classes.center, classes.right, classes.right]}
            customClassesForCells={[0, 4, 5]}
            customHeadCellClasses={[
              classes.center,
              classes.right,
              classes.right,
            ]}
            customHeadClassesForCells={[0, 4, 5]}
          />
        ) : (
          <div />
        )}
      </CardBody>
    </Card>
  )
}
