import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../Style/style.css';
import '../Style/swiper.css'

export default function ArticleCard() {
  const slideContent = (
    <div className="bg-gray-900 px-2 py-10 rounded">
      <article className="mx-auto my-10 flex max-w-md flex-col rounded-2xl px-4 shadow md:max-w-5xl md:flex-row md:items-center">
        <div className="shrink-0 my-4 md:mr-8 md:max-w-sm">
          <img
            className="rounded-2xl object-cover"
            src="https://media.istockphoto.com/id/1188362219/photo/millennial-enigmatic-pretty-girl-with-unusual-pink-dyed-hairstyle-golden-sequins-as-tears.jpg?s=612x612&w=0&k=20&c=-IWWa82NKQubkax64FCra0xC3oujfAu_7w8XcTzKzfY=  "
            alt="Fashion Model"
          />
        </div>
        <div className="py-4 sm:py-8">
          <a href="#" className="mb-6 block text-2xl font-medium text-gray-100">
            Discover the Latest Trends in Fashion
          </a>
          <p className="mb-6 text-gray-200">
            Explore our new collection that blends elegance and comfort. From casual wear to evening gowns, find the perfect outfit for any occasion.
          </p>
          <div className="flex items-center justify-end">
            <p className="ml-4 w-56">
              <strong className="block font-medium text-gray-300">Sophia Williams</strong>
              <span className="text-sm text-gray-300">Aug 12, 2024</span>
            </p>
          </div>
        </div>
      </article>
    </div>
  );

  return (
    <div className="my-3">
      <Swiper
        direction={'vertical'}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        slidesPerView={1}
        className='mx-auto rounded bg-gray-900'
        style={{ height: '400px', width: '90%' }}
      >
        <SwiperSlide className='bg-gray-900'>{slideContent}</SwiperSlide>
        <SwiperSlide className='bg-gray-900'>{slideContent}</SwiperSlide>
        <SwiperSlide className='bg-gray-900'>{slideContent}</SwiperSlide>
        <SwiperSlide className='bg-gray-900'>{slideContent}</SwiperSlide>
      </Swiper>
    </div>
  )
}
