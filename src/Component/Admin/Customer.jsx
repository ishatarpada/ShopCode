import { useState, useEffect } from "react";
import firebaseAppConfig from "../../util/firebase-config";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import Layout from "./Layout";
import moment from "moment";

const db = getFirestore(firebaseAppConfig);

const Customer = () => {

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const req = async () => {
      const snapshot = await getDocs(collection(db, "customer"));
      const temp = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        temp.push(data);
      });
      setCustomers(temp);
    }
    req();
  })

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-3xl font-semibold mb-4">Customers List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-center">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="p-4 border-b">Customer ID</th>
                <th className="p-4 border-b">Customer Name</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Mobile Number</th>
                <th className="p-4 border-b">Join Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerId}>
                  <td className="p-4 border-b">{customer.userId}</td>
                  <td className="p-4 border-b">{customer.customerName}</td>
                  <td className="p-4 border-b">{customer.email}</td>
                  <td className="p-4 border-b">{customer.contactNO}</td>
                  <td className="p-4 border-b">{moment(customer.createdAt.toDate()).format("DD-MM-YYYY")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Customer;
