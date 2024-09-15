import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'animate.css'

// admin component
import Dashboard from './Component/Admin/Dashboard'
import Products from './Component/Admin/Products'
import AddProduct from './Component/Admin/AddProduct';
import Categories from './Component/Admin/Categories';
import Addcategory from './Component/Admin/Addcategory';
import Orders from './Component/Admin/Orders'
import Customer from './Component/Admin/Customer'
import Payment from './Component/Admin/Payment'
import Settings from './Component/Admin/Settings'
import NotFound from './Component/Admin/NotFound'

// user component
import Home from './Component/Home'
// import Demo from './Component/Demo'
import Shop from './Component/shop';
import Blog from './Component/Blog';
import Category from './Component/Category';
import About from './Component/About';
import Profile from './Component/Profile';
import Order from './Component/Orders';
import Help from './Component/Help';
import FAQs from './Component/FAQs';
import Signup from './Component/Signup';
import Login from './Component/Login'
import PreGuard from './Component/Guard/PreGuard';
import Cart from './Component/Cart';
import ProductCard from './Component/ProductCard';
import Failed from './Component/Failed';


import AdminGuard from './Component/Guard/AdminGuard';

export default function App() {
  return (
    <Router >
      <Routes >
        {/* admin Route */}
        <Route element={<AdminGuard />}>
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/admin-categories' element={<Categories />} />
          <Route path='/add-category' element={<Addcategory />} />
          <Route path='/admin-products' element={<Products />} />
          <Route path='/add-product' element={<AddProduct />} />
          <Route path='/admin-orders' element={<Orders />} />
          <Route path='/admin-customers' element={<Customer />} />
          <Route path='/admin-payments' element={<Payment />} />
          <Route path='/admin-settings' element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />

        {/* User Route */}

        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/categories' element={<Category />} />
        <Route path='/about' element={<About />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/orders' element={<Order />} />
        <Route path='/help' element={<Help />} />
        <Route path='/faqs' element={<FAQs />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/showProduct' element={<ProductCard />} />
        <Route path='/failed' element={<Failed />} />

        <Route element={<PreGuard />}>
          <Route path='/sign-up' element={<Signup />} />
          <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
    </Router>
  )
}
