import { useState, useEffect } from "react";
import firebaseAppConfig from "../../util/firebase-config";
import { getFirestore, addDoc, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import { BiStore } from "react-icons/bi";
import Layout from "./Layout";
import uploadFile from "../../util/storage";
import EditCategory from "./EditCategory";

const db = getFirestore(firebaseAppConfig);

export default function Category() {
  const formName = {
    title: '',
    description: ''
  };

  const [model, setModel] = useState(false);
  const [loader, setLoader] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [updateUI, setUpdateUI] = useState(false);
  const [categoryValue, setCategoryValue] = useState(formName);
  const [editCategory, setEditCategory] = useState(null); // For tracking the category being edited

  // Handle form value changes
  const handleCategoryValue = (e) => {
    const { name, value } = e.target;
    setCategoryValue({
      ...categoryValue,
      [name]: value
    });
  };

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      setLoader(true);
      const querySnapshot = await getDocs(collection(db, "categories"));
      const temp = [];
      querySnapshot.forEach((doc) => {
        const categories = doc.data();
        categories.id = doc.id;
        temp.push(categories);
      });
      setCategoryList(temp);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories on component mount
  }, [updateUI]);

  // Create a new category
  const createCategory = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "categories"), categoryValue);
      setCategoryValue(formName);
      setModel(false);
      setUpdateUI(!updateUI);
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

  // Upload category image
  const uploadCategoryImage = async (e, id) => {
    const file = e.target.files[0];

    if (!file) {
      Swal.fire({
        icon: "error",
        title: "No File Selected",
        text: "Please select a file to upload."
      });
      return;
    }

    try {
      const filenameArray = file.name.split(".");
      const ext = filenameArray[filenameArray.length - 1];
      const filename = Date.now() + '.' + ext;
      const path = `categories/${filename}`;

      const url = await uploadFile(file, path);
      const categoryRef = doc(db, "categories", id);
      await updateDoc(categoryRef, { image: url });
      setUpdateUI(!updateUI);

      Swal.fire({
        icon: "success",
        title: "Image Uploaded Successfully"
      });
      fetchCategories(); // Refresh categories to display the new image
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.message
      });
    }
  };

  // Open the Edit Category modal
  const openEditModal = (category) => {
    setEditCategory(category); // Set the selected category for editing
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-5 px-4 container mx-auto mb-5">
        <div className="flex justify-between items-center my-5 gap-2">
          <h1 className="text-4xl font-bold text-center text-gray-900">Fashion Categories</h1>
          <button onClick={() => setModel(true)}>
            <a href="#" className="bg-slate-300 flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-center text-xl font-bold">
              <BiStore className="text-3xl" />
              Add Category
            </a>
          </button>
        </div>

        <div className={`min-h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8`}>
          {loader ? (
            <div className="col-span-full flex justify-center items-center">
              <div className="text-center text-4xl my-5">
                <i className="fa fa-spinner fa-spin text-gray-500"></i> Loading...
              </div>
            </div>
          ) : (
            categoryList.map((category) => (
              <div key={category.id} className="group relative rounded-lg shadow-lg overflow-hidden h-[460px]">
                <div className="relative">
                  <img
                    className="h-[460px] w-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                    src={category.image ? category.image : "https://images.unsplash.com/photo-1517272325758-8a2b9b51b384?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                    alt={category.title}
                  />
                  <input
                    onChange={(e) => uploadCategoryImage(e, category.id)}
                    type="file"
                    accept="image/*"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-700 to-transparent opacity-75"></div>
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-3xl font-semibold text-white">{category.title}</h3>
                  <p className="text-[1.1rem] text-gray-300 mt-2">{category.description}</p>
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={() => openEditModal(category)} // Open the modal with the selected category
                      className="flex items-center gap-2 justify-center px-6 py-3 text-gray-900 hover:text-gray-50 bg-gray-50 hover:bg-gray-900 rounded-lg text-lg font-medium transition duration-300 z-40"
                    >
                      Edit Category
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Category Modal */}
        {model && (
          <div className="bg-black bg-opacity-80 absolute top-0 left-0 h-full w-full flex justify-center items-center animate__animated animate__fadeIn z-40">
            <div className="animate__animated animate__zoomIn animate__faster bg-white w-[80%] sm:w-[50%] md:w-[50%] p-5 rounded-md border border-1">
              <div className="flex justify-between items-center model-header mb-5">
                <h1 className="text-2xl font-semibold border-b-2 border-orange-400">Add Category</h1>
                <button onClick={() => setModel(false)}>
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              <div className="model-body">
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
                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className={`px-6 py-3 ${loader ? 'bg-gray-500' : 'bg-gray-900'} text-white font-medium rounded-lg hover:bg-gray-800 transition duration-300`}
                      disabled={loader}
                    >
                      {loader ? 'Processing...' : 'Add Category'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModel(false)}
                      className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editCategory && (
          <EditCategory
            category={editCategory}
            onClose={() => setEditCategory(null)}
            refreshCategories={() => setUpdateUI(!updateUI)} 
          />
        )}
      </div>
    </Layout>
  );
}
