
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/contexts/SearchContext";

// Sample search data types
interface SearchItem {
  id: string;
  name: string;
  href: string;
}

interface SearchGroup {
  group: string;
  items: SearchItem[];
}

// Mock data - in a real app, this would come from an API or state
const searchData: SearchGroup[] = [
  {
    group: "Courses",
    items: [
      { id: "course-1", name: "Introduction to Computer Science", href: "/courses/intro-cs" },
      { id: "course-2", name: "Advanced Mathematics", href: "/courses/advanced-math" },
      { id: "course-3", name: "Modern Physics", href: "/courses/physics" },
      { id: "course-4", name: "Data Structures and Algorithms", href: "/courses/dsa" },
      { id: "course-5", name: "Web Development", href: "/courses/web-dev" },
    ]
  },
  {
    group: "Users",
    items: [
      { id: "user-1", name: "John Doe", href: "/users/john" },
      { id: "user-2", name: "Jane Smith", href: "/users/jane" },
      { id: "user-3", name: "Robert Johnson", href: "/users/robert" },
      { id: "user-4", name: "Emily Davis", href: "/users/emily" },
      { id: "user-5", name: "Michael Brown", href: "/users/michael" },
    ]
  },
  {
    group: "Resources",
    items: [
      { id: "resource-1", name: "Student Handbook", href: "/resources/handbook" },
      { id: "resource-2", name: "Teaching Guidelines", href: "/resources/guidelines" },
      { id: "resource-3", name: "Campus Directory", href: "/resources/directory" },
      { id: "resource-4", name: "Library Catalog", href: "/resources/library" },
      { id: "resource-5", name: "Academic Calendar", href: "/resources/calendar" },
    ]
  }
];

export function SearchCommand() {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();
  const [filteredResults, setFilteredResults] = useState<SearchGroup[]>(searchData);

  // Filter results when the search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = searchData.map(group => ({
        ...group,
        items: group.items.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(group => group.items.length > 0);
      
      setFilteredResults(filtered);
    } else {
      setFilteredResults(searchData);
    }
  }, [searchQuery]);

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        closeSearch();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [closeSearch]);

  const handleSelect = (href: string) => {
    navigate(href);
    closeSearch();
    setSearchQuery("");
  };

  return (
    <CommandDialog open={isSearchOpen} onOpenChange={closeSearch}>
      <CommandInput 
        placeholder="Search courses, users, resources..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {filteredResults.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => (
              <CommandItem 
                key={item.id} 
                onSelect={() => handleSelect(item.href)}
              >
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
