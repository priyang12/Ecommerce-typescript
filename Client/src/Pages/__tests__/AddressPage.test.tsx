import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@testing-library/jest-dom";

//components
import AddressPage from "../AddressPage";

it("Do not Submit on inValid", () => {
  const history = createMemoryHistory();
  const cart: any = [
    {
      name: "Test",
    },
  ];
  localStorage.setItem("cart", cart);
  render(
    <Router history={history}>
      <AddressPage />
    </Router>
  );
  userEvent.click(screen.getByText(/Continue/i));
  expect(
    screen.getByText("Please Enter All the Fields Properly")
  ).toBeInTheDocument();
});

// it("Store Address in Local Storage", () => {
//   const history = createMemoryHistory();
//   const cart: any = [
//     {
//       name: "Test",
//     },
//   ];
//   localStorage.setItem("cart", cart);
//   render(
//     <Router history={history}>
//       <AddressPage />
//     </Router>
//   );
//   const address = {
//     homeAddress: "202,Pipload",
//     city: "Surat",
//     postalCode: "456123",
//   };
//   userEvent.type(screen.getByLabelText(/homeAddress/i), address.homeAddress);
//   userEvent.type(screen.getByLabelText(/city/i), address.city);
//   userEvent.type(screen.getByLabelText(/postal Code/i), address.postalCode);

//   userEvent.click(screen.getByText(/Continue/i));
//   expect(JSON.parse(localStorage.address)).toStrictEqual(address);
// });
