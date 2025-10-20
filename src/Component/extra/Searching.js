import { useState } from "react";

const Searching = (props) => {
  const [search, setSearch] = useState("");

  const {
    data,
    setData,
    type,
    serverSearching,
  } = props;

  
  const handleSearch = () => {
    const searchValueLower = search.toLowerCase();

    if (type === "client") {
      if (searchValueLower) {
        const filteredData = data.filter((item) => {
          return Object.keys(item).some((key) => {
            if (["_id", "updatedAt", "createdAt"].includes(key)) return false;

            const itemValue = item[key];

            if (typeof itemValue === "string") {
              return itemValue.toLowerCase().includes(searchValueLower);
            } else if (typeof itemValue === "number") {
              return itemValue.toString().includes(searchValueLower);
            }
            return false;
          });
        });
        setData(filteredData);
      } else {
        setData(data); 
      }
    } else {
      serverSearching(searchValueLower);
    }
  };

  
  const handleInputChange = (e) => {
  const inputValue = e.target.value;
  setSearch(inputValue);

  const searchValueLower = inputValue.toLowerCase();

  if (type === "client") {
    if (searchValueLower) {
      const filteredData = data.filter((item) =>
        Object.keys(item).some((key) => {
          if (["_id", "updatedAt", "createdAt"].includes(key)) return false;

          const itemValue = item[key];

          if (typeof itemValue === "string") {
            return itemValue.toLowerCase().includes(searchValueLower);
          } else if (typeof itemValue === "number") {
            return itemValue.toString().includes(searchValueLower);
          }
          return false;
        })
      );
      setData(filteredData);
    } else {
      setData(data); 
    }
  } else {
    serverSearching(searchValueLower);
  }
};


 
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="col-3 " style={{ float: "right" }}>
      <div className="input-group">
        <input
          type="text"
          autoComplete="off"
          placeholder="Searching for..."
          aria-describedby="button-addon4"
          className="form-control bg-none border searchBar py-2"
          style={{ borderRadius: "8px" }}
          value={search}               
          onChange={handleInputChange} 
          onKeyPress={handleKeyPress} 
        />

        
      </div>
    </div>
  );
};

export default Searching;
