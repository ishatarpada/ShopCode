import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseAppConfig from "../util/firebase-config";
import { MdDoubleArrow } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const db = getFirestore(firebaseAppConfig);

export default function CategoryCard() {
  const [loader, setLoader] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [updateUI, setUpdateUI] = useState(false);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoader(true);
      const querySnapshot = await getDocs(collection(db, "categories"));
      const temp = [];
      querySnapshot.forEach((doc) => {
        const categories = doc.data();
        categories.id = doc.id;
        temp.push(categories);
      })
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

  const handleShowProducts = (category) => {
    navigate('/showProduct', { state: { category } });
  };

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 container mx-auto my-5">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Fashion Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loader ? (
          <div className="col-span-full flex justify-center items-center">
            <div className="text-center text-4xl my-5">
              <i className="fa fa-spinner fa-spin text-gray-500"></i> Loading...
            </div>
          </div>
        ) :
          (
            categoryList.map((category) => (
              <div key={category.id} className="group relative rounded-lg shadow-lg overflow-hidden">
                <img
                  className="h-[460px] w-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                  src={category.image ? category.image : "https://images.unsplash.com/photo-1517272325758-8a2b9b51b384?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                  alt={category.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-700 to-transparent opacity-75"></div>
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-3xl font-semibold text-white">{category.title}</h3>
                  <p className="text-[1.1rem] text-gray-300 mt-2">{category.description}</p>
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={() => handleShowProducts(category.title)}
                      className="flex items-center gap-2 justify-center px-6 py-3 text-gray-900 hover:text-gray-50 bg-gray-50 hover:bg-gray-900 rounded-lg text-lg font-medium transition duration-300">
                      Show Products <MdDoubleArrow />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        }
      </div>
    </div>
  );
}
