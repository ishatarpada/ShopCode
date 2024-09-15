import { useEffect, useState } from 'react';
import firebaseAppConfig from '../util/firebase-config';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(firebaseAppConfig);
const db = getFirestore(firebaseAppConfig);

const OrdersPage = () => {

  const [session, setSession] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user)
      } else {
        setSession(false)
        navigate('/login')
      }
    })
  }, [])

  useEffect(() => {
    const req = async () => {
      if (session) {
        const collectionOrder = collection(db, "orders");
        const queryOrder = query(collectionOrder, where("userId", "==", session.uid));
        const snapshot = await getDocs(queryOrder);
        const temp = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          temp.push(data);
          console.log(data)
        })

        setOrders(temp);
      }
    }

    req();
  }, [session])

  const getStatusColor = (status) => {
    switch (status) {
      case "dispatched":
        return "bg-red-600";
      case "returned":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-600";
      case "shipped":
        return "bg-indigo-600";
      case "delivered":
        return "bg-teal-600";
      default:
        return "bg-rose-500";
    }
  };



  return (
    <div className="container mx-auto p-6 my-3">
      <h1 className="text-4xl font-semibold mb-6 text-center">My Orders</h1>
      <div className="mx-auto my-10 grid max-w-screen-xl gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map(order => (
          <div
            key={order.id}
            className="group cursor mx-4 overflow-hidden rounded-2xl bg-white shadow-xl duration-200 hover:-translate-y-4"
          >
            <div className="flex h-60 flex-col justify-between overflow-hidden">
              <img
                src={order.image}
                alt={`Order ${order.id}`}
                className="group-hover:scale-110 h-full w-full object-cover duration-200"
              />
            </div>
            <div className="flex-1 overflow-hidden bg-white px-6 my-3">
              <h5 className="group-hover:text-indigo-600 mb-4 text-md font-bold text-nowrap">
                Order Id :-  #{order.id}
              </h5>
              <p className="mb-1 text-gray-800 text-2xl font-semibold">{order.productName}</p>
              <p className="mb-2 text-gray-600 text-xl font-medium">{order.description}</p>
              <div className="flex justify-between">
                <span className="text-lg font-bold">{order.total}</span>
                <span className={`text-lg font-bold px-5 py-2 text-white rounded ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
