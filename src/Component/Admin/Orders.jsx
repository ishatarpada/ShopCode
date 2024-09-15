import { useEffect, useState } from "react";
import firebaseAppConfig from "../../util/firebase-config";
import { getFirestore, getDocs, collection, updateDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import Layout from "./Layout";

const db = getFirestore(firebaseAppConfig);

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null); 
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const req = async () => {
            const snapshot = await getDocs(collection(db, "orders"));
            const temp = [];

            snapshot.forEach((doc) => {
                const orderData = doc.data();
                orderData.orderId = doc.id;
                temp.push(orderData);
            });

            setOrders(temp);
        };
        req();
    }, []);

    const updateOrderStatus = async (e, id) => {
        try {
            const status = e.target.value;
            const ref = doc(db, "orders", id);

            await updateDoc(ref, { status });

            Swal.fire({
                icon: "success",
                text: "Status updated successfully"
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error.message
            });
        }
    };

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

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "Unknown Date";
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
    };

    // Handle showing the address modal
    const handleShowAddress = (address) => {
        setSelectedAddress(address);
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedAddress(null);
    };

    return (
        <Layout>
            <div className="p-4">
                <h2 className="text-3xl font-semibold mb-4">Orders List</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 text-center">
                        <thead>
                            <tr className="bg-gray-900 text-white">
                                <th className="p-4 border-b">Order ID</th>
                                <th className="p-4 border-b">Customer Name</th>
                                <th className="p-4 border-b">Customer Email</th>
                                <th className="p-4 border-b">Customer Contact</th>
                                <th className="p-4 border-b">Product Name</th>
                                <th className="p-4 border-b">Product Price</th>
                                <th className="p-4 border-b">Order Date</th>
                                <th className="p-4 border-b">Shipping Address</th>
                                <th className="p-4 border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.orderId} className="text-[16px] font-medium text-center">
                                    <td className="p-4 border-b">{order.orderId}</td>
                                    <td className="p-4 border-b capitalize">{order.customerName}</td>
                                    <td className="p-4 border-b">{order.email}</td>
                                    <td className="p-4 border-b">{order.address?.contactNo || "N/A"}</td>
                                    <td className="p-4 border-b">
                                        <div className="flex justify-center items-center">
                                            <img src={order.image} alt={order.productName} className="h-12 w-12" />
                                        </div>
                                        <p>{order.productName}</p>
                                    </td>
                                    <td className="p-4 border-b">{order.price}</td>
                                    <td className="p-4 border-b">{formatTimestamp(order.createdAt)}</td>
                                    <td className="p-4 border-b">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                            onClick={() => handleShowAddress(order.address)}
                                        >
                                            Show Address
                                        </button>
                                    </td>
                                    <td className="p-4 border-b">
                                        <select
                                            className={`border border-grey-200 p-2 rounded text-white ${getStatusColor(order.status)}`}
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(e, order.orderId)}
                                        >
                                            <option value="pending" className="capitalize">pending</option>
                                            <option value="processing" className="capitalize">processing</option>
                                            <option value="dispatched" className="capitalize">dispatched</option>
                                            <option value="delivered" className="capitalize">delivered</option>
                                            <option value="shipped" className="capitalize">shipped</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal for showing the address */}
                {showModal && selectedAddress && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 min:h-screen min:w-screen bg-gray-950 opacity-80 animate__animated animate__zoomIn">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
                            <h3 className="text-2xl font-semibold mb-4">Shipping Address</h3>
                            <p><strong>Address:</strong> {selectedAddress.address}</p>
                            <p><strong>City:</strong> {selectedAddress.city}</p>
                            <p><strong>State:</strong> {selectedAddress.state}</p>
                            <p><strong>Country:</strong> {selectedAddress.country}</p>
                            <p><strong>Postal Code:</strong> {selectedAddress.pinCode}</p>
                            <p><strong>Contact No:</strong> {selectedAddress.contactNo}</p>
                            <div className="mt-4 text-right">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Orders;
