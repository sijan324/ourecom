import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCart } from '../store/cartSlice';

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize cart from localStorage or server
    dispatch(fetchCart());
  }, [dispatch]);

  return children;
};

export default AppInitializer;
