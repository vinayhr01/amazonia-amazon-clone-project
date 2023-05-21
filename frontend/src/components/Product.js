import React from 'react';
import Card from 'react-bootstrap/Card';
//import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating.js';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store.js';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Card className='hovering'>
        <Link to={`/product/${product.slug}`}>
          <img src={product.image} className="card-img-top" alt={product.name} />
        </Link>
      </Card>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}{/* include last line outside this comment */}</Card.Text>
        {product.countInStock === 0 ? <Button variant='light' disabled>Out of Stock </Button> : <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>}
      </Card.Body>
    </Card>
  );
}
export default Product;
/*{product.countInStock < 5 && product.countInStock > 0 ? <Badge bg="danger">Remaining only {product.countInStock}, order quickly</Badge>:""} prints remaining items availability as a warning of emptyness to attract users to quickly buy the product*/