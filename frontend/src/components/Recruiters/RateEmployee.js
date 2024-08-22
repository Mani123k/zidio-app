import React, { useState } from 'react';
import axios from 'axios';
import NavbarRecruiter from "../templates/NavbarRecruiter"

function RateEmployee(props) {

    const [rating, setRating] = useState('');

    async function onChangeRating(event) {
        await setRating(event.target.value);
    }

    function onSubmit(e) {
        e.preventDefault();

        console.log(props)

        axios.post('http://localhost:4000/user/editUser/'+props.match.params.userId, {rating: rating})
             .then(res => {
                alert("Rating added!");
                props.history.push('/listings')
            })
             .catch(err => {
                console.log(err.response.data);
             });
    }

    return (
        <div>
            <NavbarRecruiter /><br />
            <h1><u> Rate </u></h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Rating: </label>
                    <input type="number" 
                            className="form-control" 
                            value={rating}
                            onChange={onChangeRating}
                            min="0"
                            max="5"
                            required
                            />  
                </div>

                <div className="form-group">
                    <input type="submit" value="Rate" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}

export default RateEmployee;