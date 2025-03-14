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
      font-size: 2.5rem;
      font-weight: bold;
      color: #28a745; /* Verde para el turno actual */
    }
    .siguiente-turno {
      font-size: 1.5rem;
      color: #007bff; /* Azul para el siguiente turno */
    }
    .turno-pendiente {
      font-size: 2rem;
      color: #ffc107; /* Amarillo para turnos pendientes */
    }
    .ventanilla {
      border: 2px solid #ccc;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 10px;
      height: 100%; /* Ajuste de altura */
    }
  </style>
</head>
<body class="bg-light">

  <div class="container py-5">
    <!-- <h1 class="display-4 text-center mb-5">Sistema de Turnos - Ventanillas</h1> -->

    <div class="row">
      <!-- Ventanilla 1 -->
      <div class="col-md-4 mb-4">
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

      <!-- Ventanilla 2 -->
      <div class="col-md-4 mb-4">
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

      <!-- Ventanilla 3 -->
      <div class="col-md-4 mb-4">
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
    </div>

    <div class="row">
      <!-- Ventanilla 4 -->
      <div class="col-md-4 mb-4">
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

      <!-- Ventanilla 5 -->
      <div class="col-md-4 mb-4">
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

      <!-- Ventanilla 6 -->
      <div class="col-md-4 mb-4">
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
