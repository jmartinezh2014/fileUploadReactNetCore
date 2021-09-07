
import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FileUpload from "./components/FileUpload";

/*incrutar la uploadfiles etiqueta de componentes */
function App() {
  return (
    <div className="container" style={{ width: "600px" }}>
      <div className="my-3">
        <h3>Proyecto React</h3>
        <h4>Prueba para Carga Multiple de Archivos</h4>
      </div>

      <FileUpload/>
    </div>
  );
}





export default App;
