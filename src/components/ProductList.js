import React, { useState, useEffect } from 'react'
import { Link, Outlet } from "react-router-dom";
import axios from 'axios'

const ProductList = (props) => {

  const [productsData, setProductsData] = useState([])

  const getProductHandler = async () => {
    try {
      const res = await axios.get('https://scandiweb-junior-web-dev.000webhostapp.com/backend/', {},
        {
          headers: {
            "Accept": "application/json",
          },
          timeout: 2000
        }
      )
      const resData = res.data
      if (resData.success == false) {
        console.log(resData)
      } else {
        setProductsData(resData.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getProductHandler()
  }, [])

  //list of selected products
  const [checkedList, setCheckedList] = useState([])
  //delete products handler
  const deleteProducts = async (checkedList) => {
    var formData = new FormData();
    formData.append('ids', checkedList);
    try {
      const res = await axios.post('https://scandiweb-junior-web-dev.000webhostapp.com/backend/ProductController/deleteProducts',
        formData,
        {
          headers: {
            "Accept": "application/json",
          },
          timeout: 2000
        }
      )
      const resData = res.data
      console.log(resData)

      if (resData.success == false) {
        console.log(resData)
      } else {
        getProductHandler()
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="container main-container">
      <div className='row row-one'>
        <div className='col-md-8'>
          <h5>Product List</h5>
        </div>
        <div className='col-md-4'>
          <div className="btn-toolbar  justify-content-end" role="toolbar" aria-label="Toolbar with button groups">
            <div className="btn-group me-2" role="group" aria-label="First group">
              <Link
                to={`/add-product`}
              >
                <button type="button" className="btn btn-sm btn-secondary">ADD</button>
              </Link>
            </div>
            <div className="btn-group me-2" role="group" aria-label="Second group">
              <button type="button" className="btn btn-sm btn-outline-dark" id='delete-product-button'
                onClick={() => {
                  deleteProducts(checkedList)
                }}
              >MASS DELETE</button>
            </div>
          </div>
        </div>
      </div>
      <div className='divider'></div>
      <div className='row row-two'>
        {productsData.map((value, index) => {
          return (
            <div className='col-md-3' key={index}>
              <div className="card">
                <div className="card-body">
                  <input className="form-check-input delete-checkbox"
                    onChange={() => {
                      if (checkedList.includes(value.id)) {
                        var newList = checkedList.filter(item => item !== value.id)
                        setCheckedList(newList)
                        // console.log(newList)                        
                      } else {
                        checkedList.push(value.id)
                      }
                    }}
                    type="checkbox" id="flexCheckDefault" />
                  <h6 className="card-title text-center">{value.sku}</h6>
                  <div className="card-text text-center">{value.name}</div>
                  <div className="card-text text-center">{value.price}</div>
                  <div className="card-text text-center">{value.attribute}: {value.attribute_content}</div>
                </div>
              </div>
            </div>)
        })}
      </div>
      <div className='divider'></div>
      <div className='row row-three'>
        <div className="card-text text-center">Scandiweb Test assignment</div>
      </div>

    </div>
  )
}

export default ProductList