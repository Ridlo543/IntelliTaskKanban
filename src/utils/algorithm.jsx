// algorithm.jsx

export const sortCardsByName = (cards, sortOrder) => {
    return cards.sort((a, b) => {
      const nameA = a.title.toLowerCase();
      const nameB = b.title.toLowerCase();
      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  };
  