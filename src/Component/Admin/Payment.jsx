import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import moment from 'moment';
import Layout from './Layout';

const Payment = () => {
  const [payments, setPayments] = useState([]);


  useEffect(() => {
    const req = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/payments');
        console.log('API Response:', data); 
        if (data && data.items && Array.isArray(data.items)) {
          setPayments(data.items);
        } else {
          console.error('Expected an array in items but received:', data);
          setPayments([]);
        }
      } catch (error) {
        if (error.response) {
          console.log("Problem with the response:", error.response);
        } else if (error.request) {
          console.log("Problem with the request:", error.request);
        } else {
          console.log("Error during setup:", error.message);
        }
        Swal.fire({
          icon: 'error',
          text: error.message,
        });
      }
    };

    req();
  }, []);


  const getStatusColor = (status) => {
    switch (status) {
      case "failed":
        return "bg-red-600";
      case "captured":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-rose-500";
    }
  };

  return (
    <Layout>
      <div className="overflow-x-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Payments</h2>
        <table className="min-w-full bg-white text-center">
          <thead>
            <tr className='bg-gray-900 text-white'>
              <th className="p-4 border-b">Payment ID</th>
              <th className="p-4 border-b">Payer Name</th>
              <th className="p-4 border-b">Payer Email</th>
              <th className="p-4 border-b">Payer Mobile Number</th>
              <th className="p-4 border-b">Product Name</th>
              <th className="p-4 border-b">Payment Method</th>
              <th className="p-4 border-b">Amount</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(payments) && payments.length > 0 ? (
              payments.map(payment => (
                <tr key={payment.id}>
                  <td className="p-4 border-b">{payment.id}</td>
                  <td className="p-4 border-b capitalize">{payment.notes.name ? payment.notes.name : 'john deo'}</td>
                  <td className="p-4 border-b">{payment.email}</td>
                  <td className="p-4 border-b">{payment.contact}</td>
                  <td className="p-4 border-b">{payment.description}</td>
                  <td className="p-4 border-b">{payment.method}</td>
                  <td className="p-4 border-b">{payment.fee}</td>
                  <td className="p-4 border-b">
                    <p className={`${getStatusColor(payment.status)} text-white p-2 rounded`}>
                      {payment.status}
                    </p>
                  </td>
                  <td className="p-4 border-b">{moment.unix(payment.created_at).format('DD-MMM-YYYY hh:mm:ss A')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4 text-center">No payments found</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </Layout>
  );
};

export default Payment;
