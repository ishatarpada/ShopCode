import { useEffect, useState } from "react";
import firebaseAppConfig from "../../util/firebase-config";
import { getFirestore, addDoc, collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import uploadFile from "../../util/storage";
import Layout from "./Layout";
import { SiCaddy } from "react-icons/si";
import { FaStar } from "react-icons/fa";


const db = getFirestore(firebaseAppConfig);

const Products = () => {
  const initialFormValues = {
    productCategory: '',
    productName: '',
    description: '',
    price: '',
    discountOffer: '',
    stock: '',
    sale: ''
  };

  const [categoryList, setCategoryList] = useState([]);
  // State to manage form values
  const [formValues, setFormValues] = useState(initialFormValues);
  // state to manage loader
  const [loader, setLoader] = useState(false);
  // State to store the list of products fetched from Firestore
  const [productsList, setProductsList] = useState([]);
  const [model, setModel] = useState(false);
  const [updateUI, setUpdateUI] = useState(false);
  const [edit, setEdit] = useState(null)

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

  const fetchProducts = async () => {
    setLoader(true);
    const snapshot = await getDocs(collection(db, "products"));
    const temp = [];
    snapshot.forEach((doc) => {
      console.log(doc.id);
      const products = doc.data();
      products.id = doc.id;
      temp.push(products);
    });
    setProductsList(temp); // Set productsList with the fetched products
    setLoader(false);
  };

  // Fetch products from Firestore
  useEffect(() => {
    fetchProducts();
  }, [updateUI]);

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
      setModel(false);
      setUpdateUI(!updateUI);
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

  const uploadProductImage = async (e, id) => {
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
      const filename = Date.now() + "." + ext;
      const path = `products/${filename}`;

      const url = await uploadFile(file, path);
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, { image: url });
      setUpdateUI(!updateUI);
      Swal.fire({
        icon: "success",
        title: "Image Uploaded Successfully"
      });
      fetchProducts();
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.message
      });
    }
  }

  const deleteProduct = async (id) => {
    try {
      const ref = doc(db, "products", id)
      await deleteDoc(ref)
      setUpdateUI(!updateUI)
    }
    catch (err) {
      new Swal({
        icon: 'error',
        title: 'Failed to delete this product'
      })
    }
  }

  const editProduct = (item) => {
    setEdit(item)
    setFormValues(item)
    setModel(true)
  }

  const saveData = async (e) => {
    try {
      e.preventDefault()
      const ref = doc(db, "products", edit.id)
      await updateDoc(ref, formValues)
      setFormValues(model)
      setModel(false)
      setEdit(null)
      setUpdateUI(!updateUI)
    }
    catch (err) {
      new Swal({
        icon: 'error',
        title: 'Failed to update this product'
      })
    }
  }



  // Determine stock status style
  const checkStatus = (status) => {
    switch (status) {
      case 'in-stock':
        return "bg-blue-500";
      case 'out-of-stock':
        return "bg-red-600";
      case 'limited-stock':
        return "bg-green-600";
      default:
        return "bg-rose-500";
    }
  };

  return (
    <>
      <Layout>
        <div className="p-4">
          <div className="flex justify-between items-center my-5 gap-2">
            <h1 className="text-4xl font-bold text-center text-gray-900">Fashion Products</h1>
            <button onClick={() => setModel(true)}>
              <a href="#" className="bg-slate-900 flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-center text-xl font-bold text-white">
                <SiCaddy className="text-3xl" />
                Add Product
              </a>
            </button>
          </div>

          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center items-center m-4">
              {
                loader ? (
                  <tr>
                    <td colSpan="7" className="text-2xl font-semibold text-gray-600 text-center py-6">
                      <i className="fa fa-spinner fa-spin text-gray-500"></i> Loading...
                    </td>
                  </tr>
                ) : (
                  productsList.map((product, index) => (
                    <div className="relative m-4 w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-md" key={index}>
                      <a href="#" className="relative">
                        <img
                          className="h-60 w-full rounded-t-lg object-cover"
                          src={product.image || "https://images.unsplash.com/photo-1517272325758-8a2b9b51b384?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                          alt={product.productName}
                        />
                        <input
                          onChange={(e) => uploadProductImage(e, product.id)}
                          type="file"
                          accept="image/*"
                          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </a>
                      <span className={`absolute top-0 left-0 w-28 translate-y-4 -translate-x-6 -rotate-45 ${(product.sale == "sale") ? 'bg-red-500' : 'bg-gray-950'} text-center text-sm text-white`}>
                        {product.sale}
                      </span>
                      <div className="mt-4 px-5 pb-5">
                        <a href="#" className="flex justify-between items-center">
                          <h5 className="text-xl font-semibold tracking-tight text-slate-900">{product.productName}</h5>
                          <div className="flex justify-end items-center text-white rounded gap-3">
                            <button onClick={() => editProduct(product)} className="bg-orange-500 px-3 py-1 rounded">
                              <i className="ri-edit-box-line"></i>
                            </button>
                            <button onClick={() => deleteProduct(product.id)} className="bg-red-500 px-3 py-1 rounded">
                              <i className="ri-delete-bin-6-line"></i>
                            </button>
                          </div>
                        </a>
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
                            className={`flex items-center rounded-md ${checkStatus(product.status)} px-5 py-2.5 text-center text-sm font-medium text-white   focus:outline-none focus:ring-4 focus:ring-blue-300`}
                          >
                            {product.stock}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              }
            </div>
          </div>

          {model && (
            <div className="bg-black bg-opacity-80 absolute top-0 left-0 h-screen w-screen flex justify-center items-center animate__animated animate__fadeIn z-[50]">
              <div className="animate__animated animate__zoomIn animate__faster bg-white w-[80%] sm:w-[50%] md:w-[50%] p-5 rounded-md border border-1">
                <div className="flex justify-between items-center model-header mb-5 container mx-auto">
                  <h1 className="text-2xl font-semibold border-b-2 border-orange-400">Add Category</h1>
                  <button onClick={() => setModel(false)}>
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>
                <div className="model-body">
                  <form className="max-w-lg w-[100%] mx-auto bg-white p-8 rounded-lg shadow-md" onSubmit={edit ? saveData : createProduct}>
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
              </div>
            </div>
          )}
        </div>
      </Layout >
    </>
  );
};

export default Products;
