import Footer from "./Footer";
import Navbar from "./Navbar";
import Newsletter from "./Newsletter";


export default function About() {
  const value = [
    { title: "Quality", description: "We believe in delivering fashion that lasts, ensuring every piece in our collection is made from high-quality materials." },
    { title: "Sustainability", description: "Our commitment to sustainability means that we make conscious choices in sourcing materials and working with eco-friendly partners." },
    { title: "Innovation", description: "Always ahead of the curve, we blend classic styles with modern innovation to bring you fashion that stands out." }
  ]

  const team = [
    { name: "Sophia Williams", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=500&q=60&auto=format&fit=crop" },
    { name: "Michael Jones", role: "Creative Director", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=60&auto=format&fit=crop" },
    { name: "Emily Johnson", role: "Lead Designer", img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=500&q=60&auto=format&fit=crop" }
  ]


  return (
    <>
      <Navbar />
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header Section */}
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900">About Us</h1>
            <p className="mt-4 text-gray-700 text-lg max-w-2xl mx-auto">
              Discover our story, our values, and what makes us unique in the world of fashion.
            </p>
            <hr className="w-72 mx-auto my-3 border border-orange-500" />
          </header>

          {/* Image and Story Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            <div className="flex justify-center">
              <img
                className="rounded-lg object-cover shadow-lg w-full h-96"
                src="https://images.unsplash.com/photo-1467779009031-53938b78ca38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFzaGlvbiUyMGpvdXJuZXl8ZW58MHx8MHx8fDA%3D"
                alt="Our Journey"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-5xl font-semibold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Founded in [Year], shopcode was created with a vision to bring affordable,
                high-quality fashion to every wardrobe. We started as a small boutique and have grown into a global fashion brand.
                Our passion for creativity and design fuels everything we do.
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section className="my-16">
            <h2 className="text-5xl font-semibold text-center text-orange-500 mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {value.map((value, index) => (
                <div
                  key={index}
                  className="text-center p-12 bg-white shadow-lg rounded-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-50">
                  <h3 className="text-4xl font-bold text-gray-900 mb-4 transition-colors hover:text-orange-600">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 text-xl">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="my-16">
            <h2 className="text-4xl font-semibold text-center text-gray-900 mb-8">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((teamMember, index) => (
                <div key={index} className="text-center group">
                  <div className="relative overflow-hidden rounded-full mx-auto w-40 h-40 shadow-lg transition-transform transform group-hover:scale-110">
                    <img
                      className="w-full h-full object-cover rounded-full transition-opacity duration-300 group-hover:opacity-90"
                      src={teamMember.img}
                      alt={teamMember.name}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-4 transition-colors duration-300 group-hover:text-orange-600">
                    {teamMember.name}
                  </h3>
                  <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{teamMember.role}</p>
                </div>
              ))}
            </div>
          </section>


          {/* Call to Action Section */}
          <section className="text-center mt-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-8">Join Our Fashion Revolution</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Become a part of shopcode's fashion-forward community. Follow us on social media, stay updated with our latest collections, and be inspired by our fashion-forward ideas.
            </p>
            <a
              href="/shop"
              className="inline-block px-8 py-3 text-lg font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Shop Our Collections
            </a>
          </section>
        </div>
      </div >
      <Newsletter />
      <Footer />
    </>
  )
}
