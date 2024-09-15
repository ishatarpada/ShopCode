import Chart from 'react-apexcharts';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import avtar from "../../assets/avtar.jpg";
import Layout from './Layout';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  // Sample data for the chart
  const chartOptions = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: ['Products 1', 'Products 2', 'Products 3', 'Products 4', 'Products 5'],
    },
    title: {
      text: 'Top Selling Productss',
      align: 'center',
    },
  };

  const chartSeries = [
    {
      name: 'Sales',
      data: [30, 40, 35, 50, 49],
    },
  ];

  // Dummy Data
  const totalSales = 12000;
  const profit = 3000;
  const totalOrders = 150;
  const totalPayments = 140;
  const totalCustomers = 85;

  // Dummy chart data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [3000, 4000, 2500, 5000, 3500, 4500],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: $${context.raw}`,
        },
      },
    },
  };

  return (
    <Layout>
      <div className="dashboard">
        <h1 className='text-3xl font-bold mb-3'>Dashboard</h1>

        {/* Summary Cards */}
        <div className="flex justify-center items-center container flex-wrap gap-6 mb-6">
          <div className="bg-orange-600 text-white p-6 rounded-lg shadow-lg flex items-center">
            <i className="ri-money-dollar-circle-fill text-5xl mr-4"></i>
            <div>
              <h2 className="text-xl font-semibold">Total Sales</h2>
              <p className="text-4xl mt-0">${totalSales}</p>
            </div>
          </div>
          <div className="bg-indigo-600 text-white p-6 rounded-lg shadow-lg flex items-center">
            <i className="ri-wallet-fill text-5xl mr-4"></i>
            <div>
              <h2 className="text-xl font-semibold">Profit</h2>
              <p className="text-4xl mt-0">${profit}</p>
            </div>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex items-center">
            <i className="ri-shopping-cart-2-fill text-5xl mr-4"></i>
            <div>
              <h2 className="text-xl font-semibold">Total Orders</h2>
              <p className="text-4xl mt-0">{totalOrders}</p>
            </div>
          </div>
          <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg flex items-center">
            <i className="ri-wallet-fill text-5xl mr-4"></i>
            <div>
              <h2 className="text-xl font-semibold text-nowrap">Total Payments</h2>
              <p className="text-4xl mt-0">{totalPayments}</p></div>
          </div>
          <div className="bg-pink-600 text-white p-6 rounded-lg shadow-lg flex items-center">
            <i className="ri-wallet-fill text-5xl mr-4"></i>
            <div>
              <h2 className="text-xl font-semibold">Total Customers</h2>
              <p className="text-4xl mt-0">{totalCustomers}</p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="chart-container">
          <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Sales Overview</h2>
          <Bar data={salesData} options={options} />
        </div>

        <div className="container my-5 mx-auto bg-purple-300 text-white rounded p-10 flex justify-start items-center gap-3">
          <div className="bg-white w-[180px] h-[180px] flex justify-center items-center rounded-full">
            <img src={avtar} alt="" className='rounded-full w-[180px]' />
          </div>
          <div>
            <h1 className='text-start text-5xl'>Dashboard Report & Analytics</h1>
            <p className='text-gray-100 font-bold text-[20px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, quaerat ratione reiciendis vero laboriosam, libero facere enim temporibus consequatur pariatur nulla ut ipsa nobis dignissimos!</p>
          </div>

        </div>


      </div>
    </Layout >
  );
};

export default Dashboard;
