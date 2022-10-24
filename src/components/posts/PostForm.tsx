import { Post } from "../../api/Api";

export const PostForm: React.FC<{
  post: Post;
  displaySaveButton: boolean;
  onChange: (updatedPost: Post) => void;
  onSave: () => void;
}> = ({ post, onChange, displaySaveButton, onSave }) => {
  const handleSubmit = (event: React.FormEvent) => {
    onSave();
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="block p-6 ml-1 mb-1 w-full h-full bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
    >
      <div className="mb-6">
        <label
          htmlFor="post-title-input"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Title
        </label>
        <input
          value={post.title}
          onChange={(e) => onChange({ ...post, title: e.target.value })}
          type="text"
          id="post-title-input"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="post-body-input"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Body
        </label>
        <input
          value={post.body}
          onChange={(e) => onChange({ ...post, body: e.target.value })}
          type="text"
          id="post-body-input"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      {displaySaveButton && (
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Save changes
        </button>
      )}
    </form>
  );
};
