import React from 'react';
import { CSVLink } from "react-csv";

const Downloader = ({headers, data, filename}) => {
   
    return (
        <CSVLink className="border border-primary py-4 px-8 text-primary font-bold rounded-lg focus:outline-none" data={data} headers={headers} filename={filename}>Download</CSVLink>
    )
}

export default Downloader;