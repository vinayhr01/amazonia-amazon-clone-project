import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CheckOutSteps from '../components/CheckOutSteps';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';

export default function PaymentScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);

    const {
        cart: { ShippingAddress, Payment },
    } = state;

    const [PaymentMethodName, setPaymentMethod] = useState(
        Payment || 'PayPal'
    );

    useEffect(() => {
        if (!ShippingAddress.Address) {
            navigate('/shipping');
        }
    }, [ShippingAddress, navigate]);

    const SubmitHandler = (event) => {
        event.preventDefault();
        ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: PaymentMethodName });
        localStorage.setItem('PaymentMethod', PaymentMethodName);
        navigate('/placeorder');
    }
    return (
        <div>
            <br></br><br></br><br></br>
            <CheckOutSteps step1 step2 step3 />
            <div className="constainer small-container">
                <br />
                <Helmet>
                    <title>Payment</title>
                </Helmet>
                <h1 className='my-3'>Payment</h1>
                <Form onSubmit={SubmitHandler}>
                    <div className='mb-3'>
                        <Form.Check type='radio' id='PayPal' value='PayPal' label='PayPal' checked={PaymentMethodName === 'PayPal'} onChange={(event) => setPaymentMethod(event.target.value)}>
                        </Form.Check>
                    </div>
                    <div className='mb-3'>
                        <Form.Check type='radio' id='Stripe' value='Stripe' label='Stripe' checked={PaymentMethodName === 'Stripe'} onChange={(event) => setPaymentMethod(event.target.value)}>
                        </Form.Check>
                    </div>
                    <div className='mb-3'>
                        <Button type='submit'>Continue</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
