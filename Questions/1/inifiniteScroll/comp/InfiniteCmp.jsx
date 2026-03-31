import React, { useState, useRef } from "react";

const InfiniteCmp = () => {
  const [items, setItems] = useState(
    Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`)
  );

  const containerRef = useRef(null);

  const loadMore = () => {
    const newItems = Array.from(
      { length: 10 },
      (_, i) => `Item ${items.length + i + 1}`
    );

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleScroll = () => {
    const container = containerRef.current;

    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 5
    ) {
      loadMore();
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: "300px",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "10px",
      }}
    >
      <ul>
        {items.map((item, index) => (
          <li key={index} style={{ padding: "8px 0" }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfiniteCmp;