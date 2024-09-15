import { useState } from "react";
import firebaseAppConfig from "../../util/firebase-config";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import Swal from "sweetalert2";
import Layout from "./Layout";

const db = getFirestore(firebaseAppConfig);


export default function Addcategory() {
  const formName = {
    title: '',
    description: ''
  };
  const [categoryValue, setCategoryValue] = useState(formName);

  // Handle form value changes
  const handleCategoryValue = (e) => {
    const { name, value } = e.target;
    setCategoryValue({
      ...categoryValue,
      [name]: value
    });
  };


  // Create a new category
  const createCategory = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "categories"), categoryValue);
      setCategoryValue(formName);
      Swal.fire({
        icon: "success",
        title: "Category Added Successfully"
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message
      });
    }
  };


  return (
    <Layout >
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 container mx-auto my-5">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Add New Category</h1>
        <form className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md" onSubmit={createCategory}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Category Title</label>
            <input
              type="text"
              name="title"
              onChange={handleCategoryValue}
              value={categoryValue.title}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm lowercase"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Category Description</label>
            <textarea
              name="description"
              onChange={handleCategoryValue}
              value={categoryValue.description}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition duration-300"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
