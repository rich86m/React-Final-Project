import { useEffect, useRef } from "react";

export default function SearchBar({ value, setValue, onSearch }) {
 

  function submit(e) {
    e.preventDefault();
    onSearch(value);
  }

  return (
    <form className="input-wrap" onSubmit={submit}>
      <input
        autoFocus
        type="text"
        placeholder="Search by title..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search by title"
      />
      <button type="submit" aria-label="Search">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
}
