import { setProducts, setLoading, setError, setPaggination, setFavourites, setFavouritesToggled, setProduct } from "../slices/product";
import axios from "axios";

export const getProducts = (page, favouriteToggle) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const { data } = await axios.get(`/api/products/${page}/${10}`);
        const { products, pagination } = data;
        dispatch(setProducts(products));
        dispatch(setPaggination(pagination));
    } catch (error) {
        dispatch(setError(
            error.response && error.response.data.message ? error.response.data.message : error.message ? error.message : 'An expected error has occured.'));
    }
};


export const addToFavourites = (id) => async (dispatch, getState) => {
    const { product: { favourites } } = getState();
    const newFavourites = [...favourites, id];
    localStorage.setItem('favourites', JSON.stringify(newFavourites));
    dispatch(setFavourites(newFavourites));
}

export const removeFromFavourites = (id) => async (dispatch, getState) => {
    const { product: { favourites } } = getState();
    const newFavourites = favourites.filter((favouriteId) => favouriteId !== id);
    localStorage.setItem('favourites', JSON.stringify(newFavourites));
    dispatch(setFavourites(newFavourites));
}

export const toggleFavourites = (toggle) => async (dispatch, getState) => {
    const { product: { favourites, products } } = getState();
    if (toggle) {
        const filteredProducts = products.filter((product) => favourites.includes(product._id));
        dispatch(setFavouritesToggled(toggle));
        dispatch(setProducts(filteredProducts));
    } else {
        dispatch(setFavouritesToggled(false));
        dispatch(getProducts(1));
    }
}

export const getProduct = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try{
        const { data } = await axios.get(`/api/products/${id}`);
        dispatch(setProduct(data));
    }catch (error) {
        dispatch(setError(
            error.response && error.response.data.message ? error.response.data.message : error.message ? error.message : 'An expected error has occured.'));
    }
}