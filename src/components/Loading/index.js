import React from "react";

const Loading = () => {

    return (
        <div className="box-loading">
            <div className="spinner-border text-dark box-loading-content" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default Loading;