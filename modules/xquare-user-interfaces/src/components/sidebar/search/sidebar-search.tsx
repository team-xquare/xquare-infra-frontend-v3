import { memo, useCallback } from "react";
import {
  SideBarDiv,
  SideBarSearch,
  SideBarSearchInput,
} from "./sidebar-search-style";

interface SidebarSearchProps {
  value: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
}

const DEFAULT_PLACEHOLDER = "검색어를 입력해주세요.";

function SidebarSearchComponent({
  value,
  placeholder = DEFAULT_PLACEHOLDER,
  onSearch,
}: SidebarSearchProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearch?.(e.target.value);
    },
    [onSearch],
  );

  return (
    <SideBarDiv>
      <SideBarSearch>
        <SideBarSearchInput
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </SideBarSearch>
    </SideBarDiv>
  );
}

export const SidebarSearch = memo(SidebarSearchComponent);
