import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import Auth from "../Auth";
import { AuthProvider } from "../../Context/Authentication/AuthContext";
import "@testing-library/jest-dom";

const mock = new MockAdapter(axios);
const History = createMemoryHistory();

const setup = () =>
  render(
    <AuthProvider>
      <Router history={createMemoryHistory()}>
        <Auth />
      </Router>
    </AuthProvider>
  );

afterEach(() => {
  mock.reset();
});
it("Login on init", () => {
  setup();
  expect(screen.getByDisplayValue(/login/i)).toBeInTheDocument();
});

it("Successful login And Redirect To Home", async () => {
  setup();
  const data = {
    token: "asdbsabdibaisd45asd",
  };
  mock.onPost("/api/users/login").reply(200, data);

  userEvent.type(screen.getByLabelText(/email/i), "PatelPriyang95@gmail.com");
  userEvent.type(screen.getByLabelText(/password/i), "123456");
  userEvent.click(screen.getByText("login"));

  //Check For Loading State
  await waitForElementToBeRemoved(() => screen.queryByTestId("Loading"));

  //check For Redirect
  expect(History.location.pathname).toBe("/");

  //check For Token
  expect(localStorage.getItem("token")).toBe(data.token);
});

it("Successful Register and Redirect", async () => {
  setup();

  //Click register
  userEvent.click(screen.getByText("Register"));

  const data = {
    token: "asdbsabdibaisd45asd",
  };

  mock.onPost("/api/users/register").reply(200, data);

  //Check We are on Register Page
  expect(screen.getByDisplayValue(/Register/i)).toBeInTheDocument();

  //Fill the form
  const name = screen.getByLabelText(/name/i);
  const email = screen.getByLabelText(/email/i);
  const password = screen.getByLabelText("password");
  const password2 = screen.getByLabelText(/confirm password/i);

  userEvent.type(name, "priyang");
  userEvent.type(email, "asdasio@gmail.com");
  userEvent.type(password, "123456");
  userEvent.type(password2, "123456");

  //Click Register
  userEvent.click(screen.getByDisplayValue(/Register/i));

  //check for loading state
  await waitForElementToBeRemoved(() => screen.queryByTestId("Loading"));

  //check for redirect
  expect(History.location.pathname).toBe("/");
});
