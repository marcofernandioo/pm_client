import React from 'react';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Yeet () {
    const url = 'https://pasar-medan.herokuapp.com';
    const {data, err} = useSWR(url, fetcher);
    console.log("fucky:", data);
    
    if (!data) return <h1>loading</h1>
    if (err) return <h1>err</h1>

    return (
        <>
            {data && JSON.stringify(data)}
        </>
    )
}