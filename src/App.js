import React, { } from 'react'
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import ProductList from './components/ProductList';
import AddProduct from './components/AddProducts';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/add-product" element={<AddProduct />} />
    </Routes>
  );
}
export default App;

