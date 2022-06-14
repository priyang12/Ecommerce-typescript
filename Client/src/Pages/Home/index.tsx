import React from "react";
import { useQuery } from "react-query";
import AlertDisplay from "../../Components/AlertDisplay";
import ProductCard from "../../Components/ProductCard";
import Spinner from "../../Components/Spinner";
import { LoadProducts } from "../../API/ProductAPI";
import {
  StyledDisplay,
  StyledProducts,
} from "../../Components/StyledComponents/Products";
import type { Product } from "../../interfaces";
import { Helmet } from "react-helmet";
import { StyledHeroContainer, StyledHero } from "./StyledHero";
import SearchBar from "../../Components/SearchBar";
import { ErrorBoundary } from "react-error-boundary";
import ErrorCatch from "../../Components/ErrorCatch";

const Carousel = React.lazy(() => import("../../Components/Carousel"));

const Home = ({ title = "Products Display" }) => {
  const {
    data: ProductsData,
    error: Err,
    isLoading,
  }: { data: any; error: any; isLoading: boolean } = useQuery(
    ["products"],
    LoadProducts
  );

  if (isLoading) return <Spinner />;

  if (Err) return <AlertDisplay msg={Err} type={false} />;

  if (!ProductsData.products) return null;

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="Products Page - Browse our products"
        />
      </Helmet>
      <SearchBar />
      <StyledHeroContainer>
        <StyledHero>
          <h1>Shop at your will</h1>
          <p>
            Why not browse our products and see what we have to offer. We have
            everything you need for your next adventure.
          </p>
        </StyledHero>
        <img src={require("../../Assets/vector.png")} alt="" width={400} />
      </StyledHeroContainer>
      <ErrorCatch>
        <React.Suspense fallback={<Spinner />}>
          <Carousel />
        </React.Suspense>
      </ErrorCatch>
      <StyledDisplay>
        <h1>{title}</h1>
        <StyledProducts>
          {ProductsData?.products &&
            ProductsData?.products.map((product: Product) => (
              <ProductCard product={product} key={product._id} />
            ))}
        </StyledProducts>
      </StyledDisplay>
    </>
  );
};

export default Home;
