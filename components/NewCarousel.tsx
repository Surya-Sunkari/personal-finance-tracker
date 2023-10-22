import React from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'
import { JsxElement } from 'typescript';

function NewCarousel(newsData)
{
  console.log(newsData);
    return (
        <div>
            {
              newsData.newsData.data.map((item, index) => (
                <div className=' w-full py-2 px-2' key={index}>
                  <a className='text-blue-700 ' href={item.link}><h1>{item.title}</h1></a>
                  <h3 className='text-black'>Publisher: {item.publisher}</h3>
                  <footer className='text-black'>Published: {item.time}</footer>
                </div>
              ))
            }
        </div>
    )
}
export default NewCarousel;