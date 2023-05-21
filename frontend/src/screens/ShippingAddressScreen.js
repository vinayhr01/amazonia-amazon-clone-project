import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store.js';
import CheckOutSteps from '../components/CheckOutSteps.js';

export default function ShippingAddressScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        UserInfo,
        cart: { ShippingAddress },
    } = state;
    const [FullName, setFullName] = useState(ShippingAddress.FullName || '');
    const [Address, setAddress] = useState(ShippingAddress.Address || '');
    const [City, setCity] = useState(ShippingAddress.City || '');
    const [PostalCode, setPostalCode] = useState(
        ShippingAddress.PostalCode || ''
    );

    useEffect(() => {
        if (!UserInfo) {
            navigate('/signin?redirect=/shipping');
        }
    }, [navigate, UserInfo]);

    const [country, setCountry] = useState(ShippingAddress.country || '');
    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                FullName,
                Address,
                City,
                PostalCode,
                country,
            },
        });
        localStorage.setItem(
            'ShippingAddress',
            JSON.stringify({
                FullName,
                Address,
                City,
                PostalCode,
                country,
            })
        );
        navigate('/payment');
    };

    return (
        <div>
            <Helmet>
                <title>Shipping Address</title>
            </Helmet>
            <br></br><br></br><br></br>
            <CheckOutSteps step1 step2></CheckOutSteps>
            <div className="container small-container">
                <h1 className="my-3">Shipping Address</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="fullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            value={FullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            value={Address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="City">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            value={City}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="PostalCode">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                            value={PostalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="country">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <div className="mb-3">
                        <Button variant="primary" type="submit">
                            Continue
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}