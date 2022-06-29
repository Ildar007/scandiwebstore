import React, { useState, useRef, useCallback } from 'react'
import { Link, Outlet,  useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage, useFormik, FieldArray } from 'formik';

import * as Yup from 'yup';
import axios from 'axios'

const AddProduct = () => {
  const navigate = useNavigate()
  const formRef = useRef();
  const [productType, setProductType] = useState() 

  const submitHandler = async (values) => {

    var formData = new FormData();
    formData.append('sku', values.sku);
    formData.append('name', values.name); 
    formData.append('price', `${values.price} $`);
    formData.append('attribute', values.productType); 
    formData.append(
      'attribute_content',
      values.productType == 'Furniture' ? `${values.height} x ${values.length} x ${values.width}` :
        values.productType == 'DVD' ? `${values.size} MB` : `${values.weight} KG`
    );

    try {
      const res = await axios.post('https://scandiweb-junior-web-dev.000webhostapp.com/backend/ProductController/addProduct',
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
        navigate("/") 
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="container main-container">
      <div className='row row-one'>
        <div className='col-md-8'>
          <h5>Product Add</h5>
        </div>
        <div className='col-md-4'>
          <div className="btn-toolbar  justify-content-end" role="toolbar" aria-label="Toolbar with button groups">
            <div className="btn-group me-2" role="group" aria-label="First group">
              <button type="submit" className="btn btn-sm btn-secondary" form="product_form">Save</button>
            </div>
            <div className="btn-group me-2" role="group" aria-label="Second group">
              <Link
                to={`/`}
              >
                <button type="button" className="btn btn-sm btn-outline-dark">Cancel</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='divider'></div>
      <div className='row mx-2'>
        <Formik
          initialValues={{
            sku: '',
            name: '',
            price: '',
            productType: '',
            size: '',
            weight: '',
            height: '',
            width: '',
            length: '',
          }}
          innerRef={formRef}
          enableReinitialize={true}
          validationSchema={
            Yup.object().shape({
              sku: Yup.string().required('SKU is required'),
              name: Yup.string().required('Name is required'),
              price: Yup.string().required('Price is required'),
              productType: Yup.string().required('Select a product type'),
              size: Yup.string().when('productType', {
                is: (val) => val == "DVD",
                then: Yup.string().required('Enter size') 
              }),
              weight: Yup.string().when('productType', {
                is: (val) => val == "Book",
                then: Yup.string().required('Enter weight')
              }),
              height: Yup.string().when('productType', {
                is: (val) => val == "Furniture",
                then: Yup.string().required('Enter height'),
              }),
              width: Yup.string().when('productType', {
                is: (val) => val == "Furniture",
                then: Yup.string().required('Enter width'),
              }),
              length: Yup.string().when('productType', {
                is: (val) => val == "Furniture",
                then: Yup.string().required('Enter length'),
              })
            })
          }
          onSubmit={(values, { setSubmitting }) => {
            submitHandler(values)
          }}>
          {({
            values, errors, handleBlur, handleChange, handleSubmit, resetForm, setFieldValue, isSubmitting, isValid, dirty, touched
          }) => (
            <Form method="POST" id="product_form" name="product_form" onSubmit={handleSubmit}>
              <div className='col-lg-4 col-md-6'>
                <div className="mb-2 row">
                  <label className="col-sm-3 col-form-label">SKU</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="sku" name="sku" onChange={handleChange} />
                    <div className="form-error">
                      <ErrorMessage name="sku" />
                    </div>
                  </div>
                </div>
                <div className="mb-2 row">
                  <label className="col-sm-3 col-form-label">Name</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="name" name="name" onChange={handleChange} />
                    <div className="form-error">
                      <ErrorMessage name="name" />
                    </div>
                  </div>
                </div>
                <div className="mb-2 row">
                  <label className="col-sm-3 col-form-label">Price ($)</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="price" name="price" onChange={handleChange} />
                    <div className="form-error">
                      <ErrorMessage name="price" />
                    </div>
                  </div>
                </div>
                <div className="mb-2 row">
                  <label className="col-sm-4 col-form-label">Type Switcher</label>
                  <div className="col-sm-8">
                    <select className="form-select" id='productType' name='productType'
                      onChange={(e) => {
                        handleChange(e)
                        setProductType(e.target.value)
                      }}>
                      <option value=''>Type Switcher</option>
                      <option value="DVD" id='DVD'>DVD</option>
                      <option value="Furniture" id='Furniture'>Furniture</option>
                      <option value="Book" id='Book'>Book</option>
                    </select>
                    <div className="form-error">
                      <ErrorMessage name="productType" />
                    </div>
                  </div>
                </div>
                {values.productType == 'DVD' &&
                  (
                    <>
                      <div className="mb-2 row">
                        <label className="col-sm-4 col-form-label">Size (MB)</label>
                        <div className="col-sm-8">
                          <input type="text" className="form-control" id="size" disabled={values.productType == 'DVD' ? false : true} name="size" value={values.size} onChange={handleChange} />
                          <div className="form-error">
                            <ErrorMessage name="size" />
                          </div>
                        </div>
                      </div>
                      <div className="form-text">
                        Please provide DVD size in MB
                      </div>
                    </>
                  )}
                {values.productType == 'Book' &&
                  (
                    <>
                      <div className="mb-2 row">
                        <label className="col-sm-4 col-form-label">Weight (KG)</label>
                        <div className="col-sm-8">
                          <input type="text" className="form-control" id="weight" name="weight" value={values.weight} onChange={handleChange} />
                          <div className="form-error">
                            <ErrorMessage name="weight" />
                          </div>
                        </div>
                      </div>
                      <div className="form-text">
                        Please provide book weight in kg
                      </div>
                    </>
                  )}
                {values.productType == 'Furniture' &&
                  (
                    <>
                      <div className="mb-2 row">
                        <label className="col-sm-4 col-form-label">Height (CM)</label>
                        <div className="col-sm-8">
                          <input type="text" className="form-control" id="height" name="height" value={values.height} onChange={handleChange} />
                          <div className="form-error">
                            <ErrorMessage name="height" />
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 row">
                        <label className="col-sm-4 col-form-label">Width (CM)</label>
                        <div className="col-sm-8">
                          <input type="text" className="form-control" id="width" name="width" value={values.width} onChange={handleChange} />
                          <div className="form-error">
                            <ErrorMessage name="width" />
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 row">
                        <label className="col-sm-4 col-form-label">Length (CM)</label>
                        <div className="col-sm-8">
                          <input type="text" className="form-control" id="length" name="length" value={values.length} onChange={handleChange} />
                          <div className="form-error">
                            <ErrorMessage name="length" />
                          </div>
                        </div>
                      </div>
                      <div className="form-text">
                        Provide furniture dimensions in the form HxWxL all in CM
                      </div>
                    </>
                  )}
                {/* <ProductTypeForm name='productTypeForm' type={productType} onChange={handleChange} /> */}

              </div>
            </Form>)}
        </Formik>
      </div>
      <div className='divider'></div>
      <div className='row row-three'>
        <div className="card-text text-center">Scandiweb Test assignment</div>
      </div>

    </div >
  )
}
export default AddProduct;