import React from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify'; // npm install react-toastify,  gives error message in a modified way rather than a simple alert or bland message
import { getError } from '../utils';

export default function SignInScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { UserInfo } = state;

    const SubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post('/api/users/signin', {
                email, password,
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('UserInfo', JSON.stringify(data));
            navigate(redirect || '/');
        }
        catch (error) {
            toast.error(getError(error));
        }
    };

    useEffect(() => { // avoids moving to sign in page (which can be done by changing url in search bar) when user is already signed in
        if (UserInfo) {
            navigate(redirect);
        }
    }, [UserInfo, redirect, navigate]);

    return (
        <Container className="small-Container">
            <br /> <br />
            <Helmet>
                <title>SignIn</title>
            </Helmet>
            <h1 className='my-3'>Sign In</h1>
            <Form onSubmit={SubmitHandler}>
                <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={(event) => setEmail(event.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required onChange={(event) => setPassword(event.target.value)}></Form.Control>
                </Form.Group>
                <div className='mb-3'>
                    <Button type="submit">
                        Sign In
                    </Button>
                </div>
                <div className='mb-3'>
                    New Customer? {' '}
                    <Link to={`/signup?redirect=${redirect}`}>
                        Create an Account
                    </Link>
                </div>
            </Form>
        </Container>
    )
}