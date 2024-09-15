import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../Style/swiper.css'
import '../Style/style.css'
import banner1 from '../assets/banner1.webp';
import banner2 from '../assets/banner-2.png';
import banner3 from '../assets/banner-3.png';


export default function Slider() {
  return (
    <div className="my-3">
        <Swiper
          pagination={true}
          navigation={true}
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          className='mx-auto rounded'
          style={{height : '400px' , width:'90%'}}
        >
          <SwiperSlide>
            <img src={banner2} alt="Banner 2" className='rounded' style={{ height: '100%', width: '100%', objectFit: 'fill' }} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={banner1} alt="Banner 1" className='rounded' style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={banner3} alt="Banner 3" className='rounded' style={{ height: '100%', width: '100%', objectFit: 'fill' }} />
          </SwiperSlide>
        </Swiper>
      </div>
  )
}
