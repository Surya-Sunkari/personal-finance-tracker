import React from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'
import { JsxElement } from 'typescript';

function NewCarousel(newsData)
{
  console.log(newsData);
    return (
        <Carousel>
            {
              newsData.newsData.data.map((item, index) => (
                <div key={index}>
                  <a href={item.link}><h1>{item.title}</h1></a>
                  <h3>{item.publisher}</h3>
                  <footer>Published: {item.time}</footer>
                </div>
              ))
            }
        </Carousel>
    )
}
export default NewCarousel;