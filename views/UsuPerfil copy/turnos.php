<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema de Turnos</title>
  <!-- Enlace a Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  
  <style>
    /* Estilo adicional para personalizar */
    .turno-actual {
      font-size: 3rem;
      font-weight: bold;
      color: #28a745; /* Verde para el turno actual */
    }
    .siguiente-turno {
      font-size: 1.75rem;
      color: #007bff; /* Azul para el siguiente turno */
    }
    .turno-pendiente {
      font-size: 2rem;
      color: #ffc107; /* Amarillo para turnos pendientes */
    }

    /* Estilo para el logo o espacio reservado */
    .espacio-logo {
      /* background-color:rgb(49, 6, 6); */
      height: 100%; /* Ajustamos la altura al 100% del contenedor */
      /* border: 2px solid #007bff; */
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      height: 350px; /* Ajuste de altura */
      width: 350px; /* Ajuste de ancho */
      margin-left: 40px;
 
    }

    /* Ventanilla con ajuste de tamaño */
    .ventanilla {
      border: 2px solid #ccc;
      padding: 20px;
      /* margin-bottom: 20px; */
      border-radius: 10px;
      background-color: #f9f9f9;
      height: 100%; /* Ajuste de altura */
    }

    /* Diseño de contenedor para todo */
    .container {
      background-color: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
    }

    /* Estilo de la fila de ventanillas */
    .row-ventanillas {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    
    }

    /* Estilo para la fila de 4 ventanillas de abajo */
    .row-ventanillas-bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }

    /* Ajuste de columnas */
    .col-md-2 {
      flex: 1 1 calc(33.33% - 20px); /* Ajuste para que las ventanillas no se vean tan delgadas */
      margin: 10px;
    }

    /* Espacio para el logo */
    .col-md-4-logo {
      flex: 1 1 calc(33.33% - 20px); /* El logo ocupa el 33% del espacio restante */
      margin: 10px;
    }

    /* Ajustes responsivos */
    @media (max-width: 768px) {
      .espacio-logo {
        width: 100px;
        height: 60px;
      }
      .ventanilla {
        padding: 15px;
        width: 180px;
        min-height: 220px;
      }
    }
  </style>
</head>
<body class="bg-light">

  <div class="container py-5">
    <!-- <h1 class="display-4 text-center mb-5">Sistema de Turnos</h1> -->

    <!-- Fila para las 2 ventanillas de arriba -->
    <div class="row-ventanillas">
      <div class="col-md-2 mb-4">
        <div class="ventanilla text-center">
          <h3>Ventanilla 1</h3>
          <div class="turno-actual">Turno: 45</div>
          <div class="siguiente-turno">Siguiente: 46</div>
          <ul class="list-group mt-3">
            <li class="list-group-item turno-pendiente">Turno 47</li>
            <li class="list-group-item turno-pendiente">Turno 48</li>
          </ul>
        </div>
      </div>

      <div class="col-md-2 mb-4">
        <div class="ventanilla text-center">
          <h3>Ventanilla 2</h3>
          <div class="turno-actual">Turno: 46</div>
          <div class="siguiente-turno">Siguiente: 47</div>
          <ul class="list-group mt-3">
            <li class="list-group-item turno-pendiente">Turno 48</li>
            <li class="list-group-item turno-pendiente">Turno 49</li>
          </ul>
        </div>
      </div>

      <!-- Espacio para el logo ocupa el espacio restante -->
      <div class="col-md-4-logo mb-4">
        <div class="espacio-logo">
            <img  width="100%" height="100%" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD33HqOSUElLXzsAvWxBJ1y8Xffwsv9FmFUQ&s" alt="">
          <!-- <p class="m-0 text-center text-muted">Logo</p> -->
        </div>
      </div>
    </div>

    <!-- Fila para las 4 ventanillas de abajo -->
    <div class="row-ventanillas-bottom">
      <div class="col-md-2 mb-4">
        <div class="ventanilla text-center">
          <h3>Ventanilla 3</h3>
          <div class="turno-actual">Turno: 47</div>
          <div class="siguiente-turno">Siguiente: 48</div>
          <ul class="list-group mt-3">
            <li class="list-group-item turno-pendiente">Turno 49</li>
            <li class="list-group-item turno-pendiente">Turno 50</li>
          </ul>
        </div>
      </div>

      <div class="col-md-2 mb-4">
        <div class="ventanilla text-center">
          <h3>Ventanilla 4</h3>
          <div class="turno-actual">Turno: 48</div>
          <div class="siguiente-turno">Siguiente: 49</div>
          <ul class="list-group mt-3">
            <li class="list-group-item turno-pendiente">Turno 50</li>
            <li class="list-group-item turno-pendiente">Turno 51</li>
          </ul>
        </div>
      </div>

      <div class="col-md-2 mb-4">
        <div class="ventanilla text-center">
          <h3>Ventanilla 5</h3>
          <div class="turno-actual">Turno: 49</div>
          <div class="siguiente-turno">Siguiente: 50</div>
          <ul class="list-group mt-3">
            <li class="list-group-item turno-pendiente">Turno 51</li>
            <li class="list-group-item turno-pendiente">Turno 52</li>
          </ul>
        </div>
      </div>

      <div class="col-md-2 mb-4">
        <div class="ventanilla text-center">
          <h3>Ventanilla 6</h3>
          <div class="turno-actual">Turno: 50</div>
          <div class="siguiente-turno">Siguiente: 51</div>
          <ul class="list-group mt-3">
            <li class="list-group-item turno-pendiente">Turno 52</li>
            <li class="list-group-item turno-pendiente">Turno 53</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Scripts de Bootstrap -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
