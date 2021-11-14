import React from "react";

const Loader = ({ loading }) => {
    return loading ? <div className="loader"></div> : null;
};

export default Loader;
