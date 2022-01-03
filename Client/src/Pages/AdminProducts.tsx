import AlertDisplay from "../Components/AlertDisplay";
import Spinner from "../Components/Spinner";
import TimeoutBtn from "../Components/TimeoutBtn";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAxios } from "../Utils/CustomHooks";
import { DetailedProduct } from "../types";
import styled from "styled-components";

const StyledProducts = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  padding: 2em;
  border: 1px solid #ccc;
  margin: 1em;
  img {
    width: 100%;
    height: 100%;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;
const StyledProductTitle = styled.h2`
  margin: 0;
  color: var(--secondary-light-color);
`;
const AdminProducts = () => {
  const history = useHistory();
  const [Params, setParams] = useState<any>({
    method: "GET",
    url: "/api/products",
  });

  const { Alert, Err, FetchData, loading } = useAxios(Params);

  const Products: DetailedProduct[] = FetchData?.products;

  console.log(Products);
  const DeleteProduct = (id: string) => {
    console.log(id);
    setParams({
      method: "DELETE",
      url: `/api/products/product/${id}`,
    });
  };

  const AddNewProduct = () => {
    setParams({
      method: "POST",
      url: "/api/products",
    });
  };
  if (Alert === "Product added successfully") {
    const id = FetchData.product;
    history.push(`/UpdateProduct/${id}`);
  }

  if (loading) return <Spinner />;
  if (Err) return <AlertDisplay msg={Err} type={false} />;
  if (!FetchData) return <div>Server Error Please Try Again</div>;

  return (
    <section id='AdminProduct'>
      {Alert ? (
        <AlertDisplay msg={Alert} type={true} />
      ) : (
        <form onSubmit={AddNewProduct}>
          <TimeoutBtn FormValue='Add New Product' Time={3000} classname='btn' />
        </form>
      )}

      {Products.length > 0 ? (
        <ul>
          {Products.map((product: any, index: number) => (
            <StyledProducts key={index}>
              <div className='right'>
                <img src={product.image} alt='' />
              </div>
              <div className='left'>
                <StyledProductTitle>{product.name}</StyledProductTitle>
                <h4>description</h4>
                <span>{product.description}</span>
                <div className='details'>
                  <h3>brand : {product.brand}</h3>
                  <h3>Price : ${product.price}</h3>
                  <h3>countInStock : {product.countInStock}</h3>
                  <strong>category : {product.category}</strong>
                  <strong>
                    Last Updated : {product.updatedAt.slice(0, 10)}
                  </strong>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Link to={`/adminProducts/${product._id}`} className='btn'>
                  Edit
                </Link>
                <button
                  className='btn delete'
                  onClick={() => DeleteProduct(product._id)}
                >
                  Delete
                </button>
              </div>
            </StyledProducts>
          ))}
        </ul>
      ) : (
        <h1>No Products</h1>
      )}
    </section>
  );
};

export default AdminProducts;