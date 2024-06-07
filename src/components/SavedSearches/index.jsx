import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./index.css"
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import Category from "@mui/icons-material/Category";
import { deleteSearch, deleteAllSearches } from '../../store/authSlice';
import { newSearch } from '../../store/searchSlice';
import { useNavigate } from 'react-router-dom';

function SavedSearches({ close }) {
    const user = useSelector(state => state.auth);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return (
        <div className='saved_searches'>
            <div className="heading">
                <h2>Your Saved Searches</h2>
                <button onClick={e => { dispatch(deleteAllSearches()); close() }}>Clear All</button>
            </div>
            <div className="searches">
                {user?.data?.searches.map(search =>
                    <div className="saved_search" onClick={e => { dispatch(newSearch({ ...search })); navigate("/search"); close() }}>
                        <div className="category">
                            <Category></Category>
                            {search.category}
                        </div>
                        <hr />
                        <div className="query">
                            <SearchIcon></SearchIcon>
                            {search.query}
                        </div>


                        <div className="actions">

                            <button onClick={e => dispatch(deleteSearch(search))}><ClearIcon></ClearIcon></button>
                        </div>

                    </div>)}
            </div>
        </div >
    )
}

export default SavedSearches