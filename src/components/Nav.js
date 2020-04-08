import React, {useState} from 'react'
import Navbar from 'react-bulma-components/lib/components/navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from 'react-bulma-components/lib/components/icon'
import { faInfinity } from '@fortawesome/free-solid-svg-icons'
import AuthButton from '../features/auth/AuthButton'
import { useSelector } from 'react-redux'
import { selectConnected, selectUser } from 'features/auth/authSlice'

function Nav() {
  const connected = useSelector(selectConnected)
  const user = useSelector(selectUser)
  const [active, setActive] = useState(false)

  const toggleActive = () => setActive((active) => !active)



  return (
    <Navbar fixed="top" active={active}>
      <Navbar.Brand>
        <Navbar.Item href="/">
          <Icon>
            <FontAwesomeIcon icon={faInfinity} />
          </Icon>
        </Navbar.Item>
        <Navbar.Burger onClick={toggleActive}/>
      </Navbar.Brand>

      <Navbar.Menu>
        <Navbar.Container>
          <Navbar.Item href="http://navadra.lejolly.me">Navadra</Navbar.Item>
          <Navbar.Item href="/calcul-mental">Calcul mental</Navbar.Item>
        </Navbar.Container>

        <Navbar.Container position="end">
          {connected && (
            <>
              <Navbar.Item renderAs="div">
                <img alt="profile" src={user.imageUrl} />
              </Navbar.Item>
              <Navbar.Item renderAs="div">
                <strong>{user.name}</strong>
              </Navbar.Item>
            </>
          )}
          <Navbar.Item>
            <AuthButton />
          </Navbar.Item>
        </Navbar.Container>
      </Navbar.Menu>
    </Navbar>
  )
}

export default Nav
