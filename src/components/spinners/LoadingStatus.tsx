import { useEffect, useState } from "react";

export const FetchingStatus: React.FC<{ isFetching: boolean }> = ({
  isFetching,
}) => {
  const [visible, setVisible] = useState(isFetching);

  useEffect(() => {
    if (isFetching === true) {
      setVisible(true);
      setTimeout(() => setVisible(false), 2000);
    }
  }, [isFetching]);

  return (
    <p
      className="transition-opacity delay-150 duration-500 ease-out opacity-0"
      style={{ opacity: visible ? 1 : 0 }}
    >
      Fetching !
    </p>
  );
};
