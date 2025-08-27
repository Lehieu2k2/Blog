import Search from "antd/es/input/Search";
import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface SearchFilterProps {
  size?: "large" | "middle" | "small";
  placeholder?: string;
  query?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  size = "large",
  placeholder = "Tìm kiếm",
  query = "keyword",
}) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const onSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(query, value);
    } else {
      params.delete(query);
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <Search
      placeholder={placeholder}
      size={size}
      allowClear
      onSearch={onSearch}
      defaultValue={searchParams.get(query) || ""}
      style={{
        width: "100%",
      }}
    />
  );
};
