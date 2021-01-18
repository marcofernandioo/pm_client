import React, {useState} from 'react';
// import MUIDataTable from 'mui-datatables';

export default function Input () {
    const [total, setTotal] = useState(0);
    return (
        <>
            <form>
                <span>Mangga</span>
                <input type = 'number' onChange = {(e) => {setTotal((e.target.value) * 15000)}}/>
                <input type = 'number' value = {total} />
                <br>
                </br>
                <span>Jeruk</span>
                <input type = 'number' onChange = {(e) => {setTotal((e.target.value) * 5000)}}/>
                <input type = 'number' value = {total} />
            </form>
         
        </>
    )
}