import { InfiniteScroll } from "../controller/InfiniteScroll";
import { expect, test } from "vitest";
import { ApiTest } from "../../api/ApiTest";
import { Post } from "../../api/Api";

// #1 controller should initially be loading data
test("controller should initially be loading data", async () => {
  const controller = new InfiniteScroll<Post>(new ApiTest());
  expect(controller.loading).toBe(true);
});

// #2 after loading (await), 10 elements are set and loading is false
test("after loading (await), 10 elements are set and loading is false", async () => {
  const controller = new InfiniteScroll<Post>(new ApiTest());
  await controller.fetch(0);
  expect(controller.elements.length).toBe(10);
  expect(controller.loading).toBe(false);
});

// #3 When only 5 elements are remaining before the end of the list
// we fetch further data
test("When more than 3 elements are remaining before the end of the list, nothing appends", async () => {
  const controller = new InfiniteScroll<Post>(new ApiTest());
  await controller.fetch(0);
  await controller.onVisibilityChange(7, true);
  expect(controller.elements.length).toBe(10);
});

test("When only 3 elements are remaining before the end of the list, it fetches more data", async () => {
  const controller = new InfiniteScroll<Post>(new ApiTest());
  await controller.fetch(0);
  await controller.onVisibilityChange(8, true);
  expect(controller.elements.length).toBe(20);
  expect(controller.noMoreData).toBe(false);
});

// #4 when all data are fetched, noMoreData is true
test("When all data are fetched, noMoreData is true", async () => {
  const controller = new InfiniteScroll<Post>(new ApiTest());
  await controller.fetch(0);
  await controller.onVisibilityChange(8, true);
  await controller.onVisibilityChange(18, true);
  expect(controller.elements.length).toBe(20);
  expect(controller.noMoreData).toBe(true);
});

// #5 when a user click an element in the list, the element is displayed in the side box
test("When a user click an element in the list, the element is displayed in the side box", async () => {
  const controller = new InfiniteScroll<Post>(new ApiTest());
  await controller.fetch(0);
  await controller.onClickElementInTheList(3);
  expect(controller.currentElement?.id).toBe(3);
  expect(controller.unSavedChangesToCurrentElement).toBe(false);
});

// #6 when a user scroll and makes the current element non-visible, the element displayed
// in the side box disappears if it has not benn changed (tricky !)
test("when a user scroll and makes the current element non-visible, the element displayed in the side box disappears if it has not benn changed", async () => {
  const controller = new InfiniteScroll<Post>(new ApiTest());
  await controller.fetch(0);
  await controller.onClickElementInTheList(3);
  await controller.onVisibilityChange(3, false);
  await controller.onVisibilityChange(18, true);
  expect(controller.currentElement).toBe(null);
});

// #7 when the user changes something to the current element, a "SAVE" button appears
test("When the user changes something to the current element, a SAVE button appears", async () => {
  const controller = new InfiniteScroll<Post>(new ApiTest());
  await controller.fetch(0);
  controller.onClickElementInTheList(3);
  controller.onChangeCurrentElement({
    id: 3,
    title: "A new title",
    body: controller.currentElement?.body || "",
  });
  expect(controller.unSavedChangesToCurrentElement).toBe(true);
});

// #8 when the user clicks the "SAVE" button, the element is updated in the list, while
// the API requests (save the re-fetch) are sent.
test("When the user changes something to the current element, a SAVE button appears", async () => {
  const controller = new InfiniteScroll<Post>(new ApiTest());
  await controller.fetch(0);
  controller.onClickElementInTheList(3);
  controller.onChangeCurrentElement({
    id: 3,
    title: "A new title",
    body: controller.currentElement?.body || "",
  });
  await controller.onClickSaveButton();
  expect(controller.unSavedChangesToCurrentElement).toBe(false);
  expect(controller.elements[2].title).toBe("A new title");
});
