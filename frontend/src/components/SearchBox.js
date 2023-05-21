import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

export default function SearchBox() {
    const navigate = useNavigate();
    const [query, setQuery] = useState(''); // query is the search query and it is a state hook
    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : '/search');
    }
    return (
        <div className='search'>
            <Form className='d-flex me-auto' onSubmit={submitHandler}>
                <InputGroup>
                    <FormControl
                        type='text'
                        name='q'
                        id='q'
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Search'
                        aria-label='Search for products'
                        aria-describedby='button-search'
                    >
                    </FormControl>
                    <Button variant='outline-primary' type='submit' id='button-search'><i className='fas fa-search'></i></Button>
                </InputGroup>
            </Form>
        </div>
    )
}
