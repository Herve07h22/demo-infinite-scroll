type ID<T> = T extends { id: infer U } ? U : never;

// Dependency inversion : the controller tells what it needs
export interface InfiniteScrollApi<T> {
  list: (take: number, from?: number) => Promise<T[]>;
  save: (t: T) => Promise<void>;
}

export class InfiniteScroll<T extends { id: ID<T> }> {
  SCROLL_AREA_SIZE = 10;
  FETCH_THRESHOLD = 3;

  constructor(private api: InfiniteScrollApi<T>) {
    this.fetch();
  }

  async fetch(from?: number) {
    const startRow = from === undefined ? this.elements.length : from;
    this.loading = true;
    const fetchedElements = await this.api.list(
      this.SCROLL_AREA_SIZE,
      startRow
    );
    const fetchedElementsToAdd = fetchedElements.filter(
      (el) => !this.elements.map((e) => e.id).includes(el.id)
    );
    this.elements.push(...fetchedElementsToAdd);
    this.loading = false;
  }

  // data that should be rendered
  elements: T[] = [];
  currentElement: T | null = null;
  unSavedChangesToCurrentElement = false;
  loading: boolean = true;
  noMoreData: boolean = false;
  visibleElementIds: Set<number> = new Set();

  // Public Interactions

  async onVisibilityChange(id: ID<T>, visible: boolean) {
    const elementIndex = this.elements.findIndex((el) => el.id === id);
    if (elementIndex === -1) return;
    if (visible) {
      this.visibleElementIds.add(elementIndex);
    } else {
      this.visibleElementIds.delete(elementIndex);
    }
    const lastVisibleElementIndex = Math.max(
      ...Array.from(this.visibleElementIds.values())
    );

    const listLengthBeforeFetch = this.elements.length;
    if (this.shouldFetch(lastVisibleElementIndex)) {
      await this.fetch();
      if (
        listLengthBeforeFetch === this.elements.length &&
        this.noMoreData == false
      )
        this.noMoreData = true;
    }

    // If set & saved, is the current still visible ?
    if (
      this.currentElement &&
      !this.currentElementIsVisible() &&
      this.unSavedChangesToCurrentElement === false
    ) {
      this.currentElement = null;
    }
  }

  onClickElementInTheList(id: ID<T>) {
    const element = this.elements.find((el) => el.id === id);
    this.currentElement = element || null;
  }

  onChangeCurrentElement(element: T) {
    this.currentElement = element;
    this.unSavedChangesToCurrentElement = true;
  }

  async onClickSaveButton() {
    const indexToUpdate = this.currentElementIndex();
    if (this.currentElement && indexToUpdate >= 0) {
      await this.api.save(this.currentElement);
      this.elements[indexToUpdate] = this.currentElement;
      this.unSavedChangesToCurrentElement = false;
    }
  }

  // Private methods

  private shouldFetch(lastVisibleElementIndex: number) {
    return (
      this.elements.length >= this.FETCH_THRESHOLD &&
      this.elements.length - this.FETCH_THRESHOLD <= lastVisibleElementIndex
    );
  }
  private currentElementIsVisible() {
    if (!this.currentElement) return true;
    return this.visibleElementIds.has(this.currentElementIndex());
  }

  private currentElementIndex() {
    return this.elements.findIndex((el) => el.id === this.currentElement!.id);
  }
}
