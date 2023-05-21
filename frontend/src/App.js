import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { ToastContainer } from 'react-toastify'; // npm install react-toastify
import 'react-toastify/dist/ReactToastify.css';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
//import NavIcon from './NavIcon';
import SignInScreen from './screens/SignInScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignUpScreen from './screens/SignUpScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import CartHistoryScreen from './screens/CartHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashBoardScreen from './screens/DashBoardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import UserEditScreen from './screens/UserEditScreen';
import { toast } from 'react-toastify';
import { getError } from './utils';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, UserInfo } = state;

  const SignOutHandler = () => { // this is equivalent to writing as function SignOutHandler(){ ...... }
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('UserInfo');
    //localStorage.removeItem('ShippingAddress');
    localStorage.removeItem('PaymentMethod');
    window.location.href = '/signin';
  };

  const [sidebaropen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      }
      catch (err) {
        toast.error(getError(err));
      }
    }
    fetchCategories();
  }, [])

  return (
    <BrowserRouter>
      <div className={sidebaropen ? "d-flex flex-column site-container active-cont" : "d-flex flex-column site-container"} >
        <ToastContainer position="bottom-center" limit={1}></ToastContainer>
        <header>
          <Navbar collapseOnSelect bg="dark" variant="dark" expand="lg" fixed='top' >
            <Container>
              <Button variant='dark' onClick={() => setSidebarOpen(!sidebaropen)}>
                <i className='fas fa-bars'></i>
              </Button>&nbsp; &nbsp;
              <LinkContainer to="/">
                <Navbar.Brand>amazonia</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end" collapseOnSelect>
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {UserInfo ? (
                    <NavDropdown title={UserInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={SignOutHandler}>
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {UserInfo && UserInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div className={sidebaropen ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column' : 'side-navbar d-flex justify-content-between flex-wrap flex-column'}>
          <Nav className='flex-column text-white w-100 p-2'>
            <Nav.Item>
              <br></br><br></br>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category, index) => (
              <Nav.Item key={category}>
                <LinkContainer to={`/search?category=${category}`} onClick={() => setSidebarOpen(false)}>
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SignInScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signup" element={<SignUpScreen />} />
              <Route path="/profile" element={<ProtectedRoute> <ProfileScreen /></ProtectedRoute>} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<ProtectedRoute><OrderScreen /></ProtectedRoute>}></Route>
              <Route path="/orderhistory" element={<ProtectedRoute><CartHistoryScreen /></ProtectedRoute>}></Route>
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/admin/dashboard" element={<AdminRoute> <DashBoardScreen /> </AdminRoute>}></Route>
              <Route path="/admin/orders" element={<AdminRoute> <OrderListScreen /> </AdminRoute>}></Route>
              <Route path="/admin/users" element={<AdminRoute> <UserListScreen /> </AdminRoute>}></Route>
              <Route path="/admin/products" element={<AdminRoute> <ProductListScreen /> </AdminRoute>}></Route>
              <Route path="/admin/product/:id" element={<AdminRoute> <ProductEditScreen /> </AdminRoute>} ></Route>
              <Route path="/admin/user/:id" element={<AdminRoute> <UserEditScreen /> </AdminRoute>}></Route>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved &copy; 2022-23 </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
