import { useState } from "react";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";
import firebaseAppConfig from "../../util/firebase-config";
import Swal from "sweetalert2";

const db = getFirestore(firebaseAppConfig);

export default function EditCategory({ category, onClose, refreshCategories }) {
  const [categoryValue, setCategoryValue] = useState({
    title: category.title,
    description: category.description,
  });

  const handleCategoryValueChange = (e) => {
    const { name, value } = e.target;
    setCategoryValue({
      ...categoryValue,
      [name]: value,
    });
  };

  // Update category
  const updateCategory = async (e) => {
    e.preventDefault();
    try {
      const categoryRef = doc(db, "categories", category.id);
      await updateDoc(categoryRef, categoryValue);
      Swal.fire({
        icon: "success",
        title: "Category Updated Successfully",
      });
      refreshCategories();
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
      });
    }
  };

  // Delete category
  const deleteCategory = async () => {
    try {
      const categoryRef = doc(db, "categories", category.id);
      await deleteDoc(categoryRef);
      Swal.fire({
        icon: "success",
        title: "Category Deleted Successfully",
      });
      refreshCategories();
      onClose(); 
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-white w-[80%] sm:w-[50%] p-5 rounded-md border border-1">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold border-b-2 border-orange-400">Edit Category</h1>
          <button onClick={onClose}>
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        <form onSubmit={updateCategory}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-lg font-bold mb-2">Category Title</label>
            <input
              type="text"
              name="title"
              value={categoryValue.title}
              onChange={handleCategoryValueChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-md lowercase text-[16px] font-medium"
              required
            /> 
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-lg font-bold mb-2">Category Description</label>
            <textarea
              name="description"
              value={categoryValue.description}
              onChange={handleCategoryValueChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-md text-[16px] font-medium"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="flex justify-center gap-5">
            <button type="submit" className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg text-lg">
              Update Category
            </button>
            <button type="button" onClick={deleteCategory} className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg text-lg">
              Delete Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
