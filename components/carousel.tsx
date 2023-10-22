import React from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper } from '@mui/material'

function News_Carousel(props)
{
    var items = props.news.data
    console.log(props)
    console.log(items)
    return (
        <Carousel>
            {
                items.map( (item, i) => <Item key={i} item={item} /> )
            }
        </Carousel>
    )
}

function Item(props)
{
    return (
        <Paper>
            <a href={props.item.link}><h1>{props.item.title}</h1></a>
            <h3>{props.item.publisher}</h3>
            <footer>Published: <p>{props.item.time}</p></footer>
        </Paper>
    )
}

export default News_Carousel
