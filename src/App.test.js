import { server } from "./mocks/server";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";
import configureStore from "./redux/store";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("Given an App component", () => {
  describe("When it's rendered", () => {
    test("Then it should show the names of the robots loaded", async () => {
      const store = configureStore();
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      const text1 = await screen.findByText("Paul McCartney");
      await waitFor(() => {
        expect(text1).toBeInTheDocument();
      });
    });
  });

  describe("When the user clicks on delete in a Robot card", () => {
    test("Then the robot should be deleted", async () => {
      const store = configureStore();
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      const deleteButton = await screen.findAllByText("Delete");
      userEvent.click(deleteButton[0]);
      await waitForElementToBeRemoved(() => screen.getByText("Doraemon"));
      const text = screen.queryByText("Harry");
      expect(text).not.toBeInTheDocument();
    });
  });
});
