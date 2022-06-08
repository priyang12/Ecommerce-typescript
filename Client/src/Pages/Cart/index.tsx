import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertDisplay from "../../Components/AlertDisplay";
import ProductList, { CartItem } from "../../Components/ProductList";
import { StyledContainer, StyledCheckout } from "./StyledCart";
import {
  AddToCartQuery,
  LoadCartQuery,
  RemoveFromCartQuery,
} from "../../API/CartAPI";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "../../query";
import Spinner from "../../Components/Spinner";

const Cart = () => {
  const [TotalAmount, setTotalAmount] = useState(0);
  const [TotalProducts, setTotalProducts] = useState(0);
  const [CartItems, setCart] = useState<CartItem[]>([]);

  const [Alert, setAlert] = useState({
    msg: "",
    type: false,
  });

  const {
    data,
    error: Err,
    isFetching,
    isLoading: loading,
  } = useQuery(["Cart"], LoadCartQuery);

  const { mutate: DeleteCart, isLoading: Deleting } = useMutation(
    RemoveFromCartQuery,
    {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries(["Cart"]);
      },
      onSettled: (data) => {
        setTimeout(() => {
          setAlert({ msg: "", type: false });
        }, 3000);
      },
      onError: (err: any) => {
        setAlert(err.data.msg);
      },
    }
  );

  const { mutate: UpdateCart, isLoading: Updating } = useMutation(
    AddToCartQuery,
    {
      onSuccess: (data: any) => {
        setAlert({ msg: data.msg, type: true });
        queryClient.invalidateQueries(["Cart"]);
      },
      onSettled: () => {
        setTimeout(() => {
          setAlert({ msg: "", type: false });
        }, 3000);
      },
      onError: (err: any) => {
        setAlert(err.data.msg);
      },
    }
  );

  const UpdateQuantity = (_id: string, quantity: number) => {
    UpdateCart({
      id: _id,
      qty: quantity,
    });
  };

  const RemoveFromCart = (id: string) => {
    DeleteCart(id);
  };

  useEffect(() => {
    if (data) {
      setCart(data.products);
    }
  }, [data]);

  useEffect(() => {
    if (CartItems?.length !== 0) {
      let TotalProducts = 0;
      let TotalAmount = 0;
      const Total = CartItems?.reduce((acc: any, item: CartItem) => {
        TotalProducts += item.qty;
        return acc + item.product.price * item.qty;
      }, 0);
      TotalAmount = Math.round(Total * 100) / 100;
      setTotalAmount(TotalAmount);
      setTotalProducts(TotalProducts);
      localStorage.setItem("ProductsAmount", JSON.stringify(TotalProducts));
      localStorage.setItem("Cart", JSON.stringify(CartItems));
    }
  }, [CartItems]);

  if (loading || isFetching || Updating || Deleting) return <Spinner />;

  if (Err) return <div>Server Error</div>;

  if (CartItems?.length === 0 || !CartItems)
    return (
      <StyledContainer>
        <h1>Your Cart is Empty</h1>
      </StyledContainer>
    );

  return (
    <Fragment>
      {Alert.msg && <AlertDisplay msg={Alert.msg} type={true} />}
      <StyledContainer>
        <h1>SHOPPING CART</h1>
        {CartItems?.map((item: CartItem) => (
          <ProductList
            key={item._id}
            styledWidth="auto"
            Cart={item}
            DeleteFromCart={RemoveFromCart}
            UpdateQty={UpdateQuantity}
          />
        ))}

        <StyledContainer>
          <StyledCheckout>
            <h3>SUBTOTAL ({TotalProducts}) ITEMS</h3>
            <p>${TotalAmount}</p>
            <Link className="btn" to="/address">
              Checkout
            </Link>
          </StyledCheckout>
        </StyledContainer>
      </StyledContainer>
    </Fragment>
  );
};

export default Cart;
