import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function TestimonialSlider() {
  const testimonials = useSelector((state) => state.testimonials.items);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative">
      {/* Navigation Buttons Header */}
      <div className="flex justify-end items-center gap-2 mb-6">
        <button
          ref={prevRef}
          aria-label="Previous Testimonial"
          className="testimonial-prev-btn w-10 h-10 rounded-2xl bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 shadow-xs flex items-center justify-center transition duration-200 disabled:opacity-40"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          ref={nextRef}
          aria-label="Next Testimonial"
          className="testimonial-next-btn w-10 h-10 rounded-2xl bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 shadow-xs flex items-center justify-center transition duration-200 disabled:opacity-40"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        loop={true}
        speed={800}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
        className="pb-12"
      >
        {testimonials.map((item, idx) => (
          <SwiperSlide key={item.id || idx} className="h-auto">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition duration-300 pointer-events-none">
                <Quote className="w-20 h-20 text-indigo-900" />
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {item.tag || 'Verified Review'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100 relative z-10">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-100 shadow-xs group-hover:scale-105 transition duration-300"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition duration-200">
                    {item.author}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.role}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
