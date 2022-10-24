import VisibilitySensor from "react-visibility-sensor";
import { Post } from "./api/Api";
import { ApiTest } from "./api/ApiTest";
import { InfiniteScroll } from "./infinite-scroll/controller/InfiniteScroll";
import { ObserveVisibility } from "./infinite-scroll/hooks/ObserveVisibility";
import { PostCard } from "./components/posts/PostCard";
import { PostForm } from "./components/posts/PostForm";
import { observer, useObserver } from "./observable/observable";
import { FetchingStatus } from "./components/spinners/LoadingStatus";

const infinitePostsScroll = observer(new InfiniteScroll<Post>(new ApiTest()));

function App() {
  const controller = useObserver(infinitePostsScroll);
  return (
    <div className="p-6 w-full h-screen ">
      <div className="p-6 w-full">
        <h1 className="mb-4 text-xl font-extrabold tracking-tight leading-none text-gray-900 md:text-2xl lg:text-3xl">
          Infinite scroll demo
        </h1>
        <p className="text-base tracking-tight text-gray-500">
          This is a demo for a useless but tricky UI. Check how to separate the
          animation logic from the UI.
          <br />
          I've tried to avoid any dependency to a state management lib with a
          dead-simple observable/observer implementation.
        </p>
      </div>
      <div className="p-6 w-full flex  h-1/2 flex-row">
        <div className="flex-initial h-full w-2/3 overflow-y-auto">
          {controller.elements.map((post) => (
            <ObserveVisibility
              key={post.id}
              onVisibilityChange={(visibility) =>
                controller.onVisibilityChange(post.id, visibility)
              }
            >
              <PostCard
                post={post}
                onClick={() => controller.onClickElementInTheList(post.id)}
              />
            </ObserveVisibility>
          ))}
          {controller.noMoreData ? (
            <p className="w-full text-center"> -- End of list -- </p>
          ) : null}
        </div>
        <div className="flex-initial h-full w-1/3 h-1/2">
          {controller.currentElement ? (
            <PostForm
              post={controller.currentElement}
              onChange={(p) => controller.onChangeCurrentElement(p)}
              displaySaveButton={controller.unSavedChangesToCurrentElement}
              onSave={() => controller.onClickSaveButton()}
            />
          ) : (
            <p className="text-center w-full text-base tracking-tight text-gray-500">
              Select a post to edit
            </p>
          )}
        </div>
      </div>
      <hr />
      <FetchingStatus isFetching={controller.loading}/>
     
    </div>
  );
}

export default App;
