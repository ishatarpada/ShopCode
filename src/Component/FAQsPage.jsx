import React from 'react';

const FAQsPage = () => {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, go to the login page and click on 'Forgot Password'. Follow the instructions sent to your email."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can contact customer support by going to the Help & Support page and filling out the contact form."
    },
    {
      question: "What is the return policy?",
      answer: "Our return policy allows for returns within 30 days of purchase. Please refer to our return policy page for more details."
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">FAQs</h1>
      <div className="bg-white rounded-lg p-6">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-6">
            <button
              className="w-full text-2xl text-left bg-gray-100 px-4 py-2 rounded-md font-semibold focus:outline-none"
              onClick={() => document.getElementById(`faq-${index}`).classList.toggle('hidden')}
            >
              {faq.question}
            </button>
            <p id={`faq-${index}`} className="hidden m-2 text-xl text-gray-600">
              {faq.answer}
            </p>
          </div>
        ))}
        <div className="mt-20 flex justify-center">
          <a className="inline-flex cursor-pointer rounded-lg bg-orange-500 py-3 px-5 text-lg text-white" href="#">Still have questions?</a>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
