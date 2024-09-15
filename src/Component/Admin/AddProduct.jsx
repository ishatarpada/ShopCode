import { useState, useEffect } from "react";
import firebaseAppConfig from "../../util/firebase-config";
import { getFirestore, addDoc, collection, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import Layout from "./Layout";

const db = getFirestore(firebaseAppConfig);

export default function AddProduct() {

  const initialFormValues = {
    productCategory: '',
    productName: '',
    description: '',
    price: '',
    discountOffer: '',
    stock: '',
  };
  const [categoryList, setCategoryList] = useState([]);
  // State to manage form values
  const [formValues, setFormValues] = useState(initialFormValues);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const temp = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id);
          const categories = doc.data();
          categories.id = doc.id;
          temp.push(categories);
        })
        setCategoryList(temp);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };
    fetchCategories(); // Fetch categories on component mount
  });


  // Handle input change for the form
  const handleProductValue = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Create a new product in Firestore
  const createProduct = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), formValues);
      setFormValues(initialFormValues); // Reset form
      Swal.fire({
        icon: "success",
        title: "Product Added",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message,
      });
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 container mx-auto my-5">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Add New Product</h1>
        <form className="max-w-lg w-[100%] mx-auto bg-white p-8 rounded-lg shadow-md" onSubmit={createProduct}>
          <div className="mb-4">
            <label htmlFor="productCategory" className="block text-gray-700 text-sm font-bold mb-2">
              Product Category
            </label>
            <select
              name="productCategory"
              onChange={handleProductValue}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              {
                categoryList.map((category, index) => (
                  <option key={index} value={category.title}>{category.title}</option>
                ))
              }

            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="productName" className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
            <input
              type="text"
              name="productName"
              onChange={handleProductValue}
              value={formValues.productName}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Product Description</label>
            <textarea
              name="description"
              onChange={handleProductValue}
              value={formValues.description}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Product Price</label>
            <input
              type="number"
              name="price"
              onChange={handleProductValue}
              value={formValues.price}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Product Discount Offer</label>
            <input
              type="number"
              name="discountOffer"
              onChange={handleProductValue}
              value={formValues.discountOffer}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="productCategory" className="block text-gray-700 text-sm font-bold mb-2">
              Sale
            </label>
            <select
              name="sale"
              onChange={handleProductValue}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select a category</option>
              <option value="sale">Sale</option>
              <option value="no-sale">No Sale</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="productCategory" className="block text-gray-700 text-sm font-bold mb-2">
              Stock
            </label>
            <select
              name="stock"
              onChange={handleProductValue}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select a category</option>
              <option value="in-stock">In Stock</option>
              <option value="limited-stock">Limited Stock</option>
              <option value="out-of-stock">Out Of Stock</option>
            </select>
          </div>
          <div className="flex justify-center">
            <button type="submit" className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition duration-300">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
