import React, { useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NewCarousel = ({newsData}) => {

    useEffect(() => {
        console.log(newsData.data[0])
    }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    width: 500
  };

  return (
    <div>
      <Slider {...settings}>
        {newsData.data.map((item, index) => (
          <div key={index}>
            <a href={item.link}><h1>{item.title}</h1></a>
            <h3>{item.publisher}</h3>
            <footer>Published: {item.time}</footer>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewCarousel;
