import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, getFirestore, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import firebaseAppConfig from '../util/firebase-config';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import Swal from 'sweetalert2';
import axios from 'axios';
import useRazorpay from "react-razorpay";
import Navbar from "./Navbar"
import Newsletter from "./Newsletter"
import Footer from "./Footer"

const auth = getAuth(firebaseAppConfig);
const db = getFirestore(firebaseAppConfig);

export default function ProductCard() {

  const [Razorpay] = useRazorpay();
  const location = useLocation();
  const navigate = useNavigate();

  const { category } = location.state;
  const [updateUI, setUpdateUI] = useState(false);
  const [products, setProducts] = useState([]);
  const [session, setSession] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [address, setAddress] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
      } else {
        setSession(null);
      }
    })
  }, [updateUI])

  const fetchProducts = async () => {
    const productsCollection = collection(db, "products");
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return productList;
  }

  useEffect(() => {
    async function getProducts() {
      try {
        const allProducts = await fetchProducts();
        const filteredProducts = allProducts.filter(product => product.productCategory === category);
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    if (category) {
      getProducts();
    }
  }, [category]);

  useEffect(() => {
    const req = async () => {
      if (session) {
        const col = collection(db, "addresses");
        const q = query(col, where("userId", "==", session.uid));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          const data = doc.data();
          setAddress(data);
        })
      }
    }
    req();
  }, [session])

  const addToCart = async (item) => {
    try {
      const q = query(
        collection(db, "carts"),
        where("userId", "==", session.uid),
        where("id", "==", item.id)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        item.userId = session.uid;
        item.createdAt = serverTimestamp();
        await addDoc(collection(db, "carts"), item);
        setUpdateUI(!updateUI);

        Swal.fire({
          title: "Good job!",
          text: "Product added successfully to the cart!",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "OOPS!",
          text: "Product is already in the cart!",
          icon: "error",
        });
      }
    } catch (error) {
      // Handle any errors
      Swal.fire({
        title: "Error!",
        text: `Failed: ${error.message}`,
        icon: "error",
      });
    }
  };


  const buyNow = async (product) => {
    try {
      const col = collection(db, "addresses");
      const q = query(col, where("userId", "==", session.uid))
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        Swal.fire({
          icon: 'info',
          title: "please update Your addresses",
          confirm: () => alert()
        })
          .then((result) => {
            if (result.isConfirmed) {
              navigate("/profile")
            }
          })
        return false;
      }
      product.userId = session.uid;
      product.status = "pending"
      const price = Number(product.price) - (Number(product.price) * Number(product.discountOffer) / 100);
      const { data } = await axios.post(`http://localhost:8080/orders`, { amount: price });
      const options = {
        key: "rzp_test_1jKJVr2znzLDYS",
        amount: data.amount,
        order_id: data.orderId,
        name: "ShopCode",
        currency: "USD",
        description: product.productName,
        image: "https://images.unsplash.com/photo-1591303927954-2b12006ca0c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbiUyMGxvZ298ZW58MHx8MHx8fDA%3D",
        handler: async (res) => {
          product.email = session.email,
            product.customerName = session.displayName,
            product.createdAt = serverTimestamp();
          product.address = address;
          await addDoc(collection(db, "orders"), product);
          console.log(res);
          navigate("/orders")
        },
        notes: {
          name: session.displayName
        }
      };
      const rjp = new Razorpay(options);
      rjp.open();

      rjp.on("payment.failed", function () {
        navigate("/failed")
      });

    } catch (error) {
      console.log(error);
    }
  }

  const handleProductClick = (product) => {
    console.log("hi")
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-12 capitalize">{category} Products</h1>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {products.map((product) => (
            <div className="relative m-4 w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-md" key={product.id}>
              <a className="relative">
                <img
                  className="h-60 w-full rounded-t-lg object-cover"
                  src={product.image || "https://images.unsplash.com/photo-1517272325758-8a2b9b51b384?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                  alt={product.productName}
                />
              </a>
              {product.sale === "sale" && (
                <span className="absolute top-0 left-0 w-28 translate-y-4 -translate-x-6 -rotate-45 bg-red-500 text-center text-sm text-white">
                  {product.sale}
                </span>
              )}
              <div className="mt-4 px-5 pb-5">
                <button onClick={() => handleProductClick(product)}>
                  <h5 className="text-xl font-semibold tracking-tight text-slate-900">{product.productName}</h5>
                </button>
                <div className="mt-2.5 mb-5 flex items-center">
                  <span className="mr-2 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">5.0</span>
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                </div>
                <div className="flex items-center justify-between">
                  <p>
                    <span className="text-3xl font-bold text-slate-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <br></br>
                    <span className="ml-2 text-sm text-slate-900 line-through">
                      ${Number(product.price - (Number(product.price) * Number(product.discountOffer) / 100)).toFixed(2)}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="flex items-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    <i className="ri-shopping-cart-fill text-white"></i>
                    Add to cart
                  </button>
                </div>
                <div className="flex justify-center items-center bg-orange-500 px-5 py-2.5 mt-3 w-full rounded">
                  <button
                    type="button"
                    onClick={() => buyNow(product)}
                    className="flex items-center rounded-md text-sm font-medium text-white"
                  >
                    <i className="ri-shopping-cart-2-line mr-1 text-white text-xl"></i>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">{selectedProduct.productName}</h2>
                <button
                  onClick={handleCloseModal}
                  className="ri-close-circle-fill mb-4 text-2xl text-red-500"
                >
                </button>
              </div>
              <img
                className="w-full h-60 object-cover rounded-lg mb-4"
                src={selectedProduct.image || "https://images.unsplash.com/photo-1517272325758-8a2b9b51b384?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                alt={selectedProduct.productName}
              />
              <p className="text-sm text-gray-600 mb-4">{selectedProduct.description}</p>
              <p className="text-lg font-semibold">
                Price: $
                {Number(selectedProduct.price - (Number(selectedProduct.price) * Number(selectedProduct.discountOffer) / 100)).toFixed(2)}
              </p>

            </div>
          </div>
        )}
      </div>

      <Newsletter />
      <Footer />
    </>
  );
}
