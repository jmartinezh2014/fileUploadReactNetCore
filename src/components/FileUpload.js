import React, { useState, useEffect, useRef } from "react";
import UploadService from "../services/FileUploadService";

const UploadFiles = () => {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [progressInfos, setProgressInfos] = useState({ val: [] });
    const [message, setMessage] = useState([]);
    const [fileInfos, setFileInfos] = useState([]);
    const progressInfosRef = useRef(null)
   

    /**
     selectFiles(): función que nos ayuda a obtener los archivos seleccionados del <input type="file" >elemento más tarde. 
     */
    const selectFiles = (event) => {
        setSelectedFiles(event.target.files);
        setProgressInfos({ val: [] });
    };
    /**
     hasta aqui select files
     */

    /**
     uploadFiles():para cada archivo, invocamos la upload()función que llama al UploadService.upload()método con un iparámetro index ( ) y devuelve un Promise.
    Una vez finalizados todos los procesos, llamamos UploadService.getFiles()para obtener la información de los archivos y asignamos el resultado al fileInfosestado, que es una matriz de {name, url}objetos.
    */

    const uploadFiles = () => {
        const files = Array.from(selectedFiles);

        let _progressInfos = files.map(file => ({ percentage: 0, fileName: file.name }));

        progressInfosRef.current = {
            val: _progressInfos,
        }
        const uploadPromises = files.map((file, i) => upload(i, file));

        Promise.all(uploadPromises)
            .then(() => UploadService.getFiles())
            .then((files) => {
                setFileInfos(files.data);
            });

        setMessage([]);
    };
    /**
 hasta aqui upload files
 */

    /**
const upload: El progreso se calculará basándose en event.loadedy event.totaly el índice asigna un valor porcentual a un elemento específico de progressInfos.
*/
const upload = (idx, file) => {
    let _progressInfos = [...progressInfosRef.current.val];
    return UploadService.upload(file, (event) => {
      _progressInfos[idx].percentage = Math.round(
        (100 * event.loaded) / event.total
      );
      setProgressInfos({ val: _progressInfos });
    })
      .then(() => {
        setMessage((prevMessage) => ([
          ...prevMessage,
          "Uploaded the file successfully: " + file.name,
        ]));
      })
      .catch(() => {
        _progressInfos[idx].percentage = 0;
        setProgressInfos({ val: _progressInfos });

        setMessage((prevMessage) => ([
          ...prevMessage,
          "Could not upload the file: " + file.name,
        ]));
      });
  };
    /**
hasta aqui upload
*/

    /**
const useEffect: ambién necesitamos hacer este trabajo en el useEffect()método Effect Hook , que tiene el mismo propósito que componentDidMount()
*/

    useEffect(() => {
        UploadService.getFiles().then((response) => {
            setFileInfos(response.data);
        });
    }, []);
    /**
hasta aqui useEffect
*/

/*BLOQUE DEL RETURN */
    return (
        <div>
            {progressInfos && progressInfos.val.length > 0 &&
                progressInfos.val.map((progressInfo, index) => (
                    <div className="mb-2" key={index}>
                        <span>{progressInfo.fileName}</span>
                        <div className="progress">
                            <div
                                className="progress-bar progress-bar-info"
                                role="progressbar"
                                aria-valuenow={progressInfo.percentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{ width: progressInfo.percentage + "%" }}
                            >
                                {progressInfo.percentage}%
                    </div>
                        </div>
                    </div>
                ))}
            <div className="row my-3">
                <div className="col-8">
                    <label className="btn btn-default p-0">
                        <input type="file" multiple onChange={selectFiles} />
                    </label>
                </div>

                <div className="col-4">
                    <button
                        className="btn btn-success btn-sm"
                        disabled={!selectedFiles}
                        onClick={uploadFiles}
                    >
                        Upload
          </button>
                </div>
            </div>
            {message.length > 0 && (
                <div className="alert alert-secondary" role="alert">
                    <ul>
                        {message.map((item, i) => {
                            return <li key={i}>{item}</li>;
                        })}
                    </ul>
                </div>
            )}
            <div className="card">
                <div className="card-header">List of Files</div>
                <ul className="list-group list-group-flush">
                    {fileInfos &&
                        fileInfos.map((file, index) => (
                            <li className="list-group-item" key={index}>
                                <a href="#" >{file.name} </a>
                            </li>
                        ))}
                </ul>
            </div>
           
        </div>
    );
};

export default UploadFiles;