import { SearchFilter } from "../filter/Search";

export const UserFilter = () => {
  return (
    <div className="grid grid-cols-4">
      <SearchFilter size="large" placeholder="Tìm kiếm" query="keyword" />
    </div>
  );
};

export default UserFilter;
