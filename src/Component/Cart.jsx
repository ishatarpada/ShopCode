import { useEffect, useState } from "react";
import firebaseAppConfig from "../util/firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, getDocs, collection, query, where, doc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import axios from "axios";
import useRazorpay from "react-razorpay";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const auth = getAuth(firebaseAppConfig);
const db = getFirestore(firebaseAppConfig);

export default function Cart() {
  const [Razorpay] = useRazorpay();
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [session, setSession] = useState(null);
  const [updateUI, setUpdateUI] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const shippingCost = 8.00;
  const navigate = useNavigate();

  // Update session when auth state changes
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
      } else {
        setSession(null);
      }
    });
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      if (session) {
        const col = collection(db, "addresses");
        const q = query(col, where("userId", "==", session.uid));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          const data = doc.data();
          setAddress(data);
        });
      }
    };
    fetchAddress();
  }, [session]);

  // Fetch cart items based on session
  useEffect(() => {
    const fetchCartItems = async () => {
      if (session) {
        const col = collection(db, "carts");
        const q = query(col, where("userId", "==", session.uid));
        const snapshot = await getDocs(q);
        const temp = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          temp.push({
            ...data,
            quantity: data.quantity || 1,
            id: doc.id
          });
        });
        setCartItems(temp);
      }
    };
    fetchCartItems();
  }, [session, updateUI]);

  // Update subtotal whenever cartItems changes
  useEffect(() => {
    const calculateSubtotal = () => {
      let total = 0;
      cartItems.forEach(item => {
        total += item.price - (item.price * item.discountOffer) / 100;
      });
      setSubtotal(total);
    };
    calculateSubtotal();
  }, [cartItems]);

  const totalPrice = subtotal + shippingCost;

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      const itemDoc = doc(db, "carts", itemId);
      await deleteDoc(itemDoc);

      setUpdateUI(!updateUI);

      Swal.fire({
        title: "Item Removed",
        text: "The item has been successfully removed from your cart.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "There was an error removing the item. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Increase item quantity
  const increaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  // Decrease item quantity
  const decreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && (item.quantity || 1) > 1
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
    );
  };

  // Handle the buy now process
  const buyNow = async () => {
    try {
      const price = totalPrice;
      const { data } = await axios.post(`http://localhost:8080/orders`, { amount: price });
      const options = {
        key: "rzp_test_1jKJVr2znzLDYS",
        amount: data.amount,
        order_id: data.orderId,
        name: "ShopCode",
        currency: "USD",
        description: "Bulk Product",
        image: "https://images.unsplash.com/photo-1591303927954-2b12006ca0c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbiUyMGxvZ298ZW58MHx8MHx8fDA%3D",
        handler: async (res) => {
          for (let item of cartItems) {
            let product = {
              ...item,
              userId: session.uid,
              status: "pending",
              email: session.email,
              customerName: session.displayName,
              createdAt: serverTimestamp(),
              address: address
            };
            await addDoc(collection(db, "orders"), product);
            await removeItem(item.id);
          }
          navigate("/orders");
        },
        notes: {
          name: session.displayName
        }
      };
      const rzp = new Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function () {
        navigate("/failed");
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <section className="bg-gray-100 py-12 sm:py-16 lg:py-20 font-serif">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-900">Your Cart</h1>
          </div>
          <div className="mx-auto mt-8 max-w-2xl md:mt-12">
            <div className="bg-white shadow">
              <div className="px-4 py-6 sm:px-8 sm:py-10">
                <div className="flow-root">
                  <ul className="-my-8">
                    {cartItems.length === 0 ? (
                      <p className="bg-red-50 text-red-600 p-2 text-center font-bold text-xl">No items in cart</p>
                    ) : (
                      cartItems.map((item, index) => (
                        <li className="mb-10" key={index}>
                          <div className="flex justify-between items-start py-3">
                            <div className="flex justify-start items-center gap-3 flex-wrap">
                              <div className="shrink-0">
                                <img
                                  className="h-48 w-48 max-w-full rounded-lg object-cover shadow shadow-black"
                                  src={item.image}
                                  alt=""
                                />
                              </div>
                              <div className="">
                                <p className="text-2xl font-bold text-gray-900 text-nowrap mb-2">
                                  {item.productName}
                                </p>
                                <p className="shrink-0 text-xl text-nowrap font-semibold mb-3">
                                  Price :- ${Number(item.price - (Number(item.price) * Number(item.discountOffer) / 100)).toFixed(2)}
                                  <span className="font-bold text-sm text-line-through ms-2 line-through text-red-600"> ${item.price}</span>
                                </p>
                                <div className="mx-auto flex h-8 items-stretch text-gray-600 font-bold mb-5 leading-8">
                                  <button
                                    className="flex text-white font-bold text-xl items-center justify-center rounded bg-gray-800 px-4 transition"
                                    onClick={() => decreaseQuantity(item.id)}
                                  >
                                    -
                                  </button>
                                  <div className="flex w-full items-center justify-center bg-gray-100 px-4 text-xs uppercase transition ">
                                    {item.quantity}
                                  </div>
                                  <button
                                    className="flex text-white font-bold text-xl items-center justify-center rounded bg-gray-800 px-4 transition"
                                    onClick={() => increaseQuantity(item.id)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4 flex">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out shadow-md"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <hr className="border-gray-200" />
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white shadow mt-5">
              <div className="px-4 py-6 sm:px-8 sm:py-10">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg uppercase text-gray-900">Subtotal: <span className="text-lg">${subtotal.toFixed(2)}</span></h3>
                  <p className="text-lg font-bold uppercase">Shipping: <span className="text-lg">${shippingCost.toFixed(2)}</span></p>
                </div>
                <div className="flex justify-between items-center">
                  <h1 className="font-bold text-xl uppercase text-gray-900">Total: <span className="text-lg">${totalPrice.toFixed(2)}</span></h1>
                  {
                    cartItems.length > 0 && <button onClick={buyNow} className="bg-gray-900 hover:bg-gray-700 text-white text-lg font-bold py-3 px-5 uppercase transition duration-300 ease-in-out shadow-lg">
                      Buy now
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
