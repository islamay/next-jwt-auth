import _ from 'lodash'
import React, { useState, useEffect, SetStateAction, ChangeEvent } from 'react'
import axios, { AxiosResponse } from 'axios'
import { decode } from 'jsonwebtoken'
import styles from 'src/styles/Home.module.css'
import useToggle from 'src/hooks/useToggle'
import type { CreateUserOutput } from 'src/models/users/createUser'
import type { NextPage } from 'next'
import type { JwtPayload } from 'jsonwebtoken'
import type { Token } from 'src/utils/token'

interface user {
  username?: string,
  email?: string,
  avatar?: string
}

interface AuthProps {
  authMethodIsLogin: boolean,
  toggleAuthMethodIsLogin: () => void;
  setUsername: React.Dispatch<SetStateAction<string>>;
  setPassword: React.Dispatch<SetStateAction<string>>;
  setEmail?: React.Dispatch<SetStateAction<string>>;
  setAvatar?: React.Dispatch<SetStateAction<string>>;
}

const LoginCard: React.FC<AuthProps & { onLogin?: () => void }> = ({
  toggleAuthMethodIsLogin,
  setUsername,
  setPassword,
  onLogin,
}) => {
  return (
    <div className={styles['input-card']}>
      <h3>Login</h3>
      <input
        onChange={handleInputChange(setUsername)}
        placeholder='username'
        type="text" className={styles.input}
      />
      <input
        onChange={handleInputChange(setPassword)}
        placeholder='password'
        type="password" className={styles.input}
      />
      <p>
        <a href="#" onClick={toggleAuthMethodIsLogin}>Signup</a> Instead
      </p>
      <button onClick={onLogin} className={styles['btn-login']}>Login</button>
    </div>
  )
}

const SignupCard: React.FC<AuthProps & { onSignup?: () => void }> = ({
  toggleAuthMethodIsLogin,
  setUsername,
  setPassword,
  setAvatar,
  setEmail,
  onSignup,
}) => {
  return (
    <div className={styles['input-card']}>
      <h3>Signup</h3>
      <input
        onChange={handleInputChange(setUsername)}
        placeholder='username'
        type="text" className={styles.input}
      />
      <input
        onChange={handleInputChange(setEmail)}
        placeholder='email'
        type="email" className={styles.input}
      />
      <input
        onChange={handleInputChange(setAvatar)}
        placeholder='avatar link'
        type="avatar" className={styles.input}
      />
      <input
        onChange={handleInputChange(setPassword)}
        placeholder='password'
        type="password" className={styles.input}
      />
      <p>
        <a href="#" onClick={toggleAuthMethodIsLogin}>Login</a> Instead
      </p>
      <button onClick={onSignup} className={styles['btn-login']}>Signup</button>
    </div>
  )
}

const handleInputChange = (setState: any) => {
  return (event: any) => {
    setState(event.target.value)
  }
}

const Home: NextPage = () => {
  const [user, setUser] = useState<user>({})
  const [accessToken, setAccessToken] = useState<string>()
  const [authMethodIsLogin, toggleAuthMethodIsLogin] = useToggle(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    axios.post('/api/auth/refresh')
      .then((res) => {
        const accessToken = res.data.accessToken as string
        const decoded = decode(accessToken) as JwtPayload & Token

        setAccessToken(accessToken)
        setUser(decoded)

      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  const handleLogout = async () => {
    try {
      const res = await axios.delete('/api/auth/logout')
      setAccessToken('')
      setUser({})
    } catch (error) {
      // Do Nothing
    }
  }

  const handleLogin = async () => {
    try {
      const res: AxiosResponse<{ accessToken: string }> = await axios.post('/api/auth/login', { username, password })
      const accessToken = res.data.accessToken
      const decoded = decode(accessToken) as JwtPayload & Token

      setAccessToken(accessToken)
      setUser(decoded)

    } catch (error) {

    }
  }

  const handleSignup = async () => {
    try {
      const res: AxiosResponse<CreateUserOutput> = await axios.post('/api/auth/signup', {
        username,
        email,
        avatar,
        password
      })

      setUser({ username: res.data.user.username, avatar: res.data.user.avatar, email: res.data.user.email })
      setAccessToken(res.data.accessToken)

    } catch (error) {
      console.log(error);

    }
  }

  return (
    <div className={styles.container}>

      {
        _.isEmpty(user) && (
          authMethodIsLogin
            ? <LoginCard
              onLogin={handleLogin}
              authMethodIsLogin={authMethodIsLogin}
              toggleAuthMethodIsLogin={toggleAuthMethodIsLogin}
              setUsername={setUsername}
              setPassword={setPassword}
            />
            : <SignupCard
              onSignup={handleSignup}
              authMethodIsLogin={authMethodIsLogin}
              toggleAuthMethodIsLogin={toggleAuthMethodIsLogin}
              setUsername={setUsername}
              setPassword={setPassword}
              setAvatar={setAvatar}
              setEmail={setEmail}
            />
        )
      }

      {
        !_.isEmpty(user) &&
        (
          <div className={styles.card}>
            <img className={styles.avatar} src={user.avatar} alt="" />
            <h3>{user.username}</h3>
            <button
              onClick={handleLogout}
              className={styles['btn-logout']}
            >Logout</button>
          </div>
        )
      }

    </div>
  )
}

export default Home
