//Para requerir galp, browserSync y sass
const gulp = require('gulp'); //Permite automatizar tareas comunes de desarrollo.
const browserSync = require('browser-sync').create(); //Permite que se reinicie el navegador automáticamente cuando hago cambios.
const sass = require('gulp-sass'); //modulo de gulp para convertir el código

//Tareas

//Una tarea se instancia a través de gulp.task, un nombre y la función que se ejecutará cuando dicha tarea se invoque.
//La tarea 'sass'convierte el código de bootstrap y también el código que escribamos en la carpeta scss a css
gulp.task('sass', () => {
  //el método src de gulp toma un arreglo con unos archivos de origen
  return gulp.src([
    'node_modules/bootstrap/scss/bootstrap.scss',
    'src/scss/*.scss'
  ])
  //con el método .pipe le digo que ejecute la tarea sass 
  .pipe(sass({outputStyle: 'compressed'}))//para comprimir el código
  .pipe(gulp.dest('src/css'))//para decirle en que ruta colocar los archivos
  .pipe(browserSync.stream());//para reiniciar el navegador automáticamente
});

//Copiamos los archivos js que están en la carpeta node_modules (bootstrap.min.js, jquery.min.js y popper.min.js) 
//para la carpeta src/js para poder verlos
gulp.task('js', () => {
  //Leo los archivos bootstrap.min.js, jquery.min.js y popper.min.js
  return gulp.src([
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/popper.js/dist/umd/popper.min.js'
  ])
  //para copiarlos en 'src/js'
  .pipe(gulp.dest('src/js'))
  .pipe(browserSync.stream());//Para decirle que reinicie el navegador
});


//cuando ejecuto la tarea 'serve' (para crear un servidor) mando a ejecutar la tarea ['sass']
gulp.task('serve', ['sass'], () => {
  browserSync.init({ //para tener un servidor de desarrollo
    server: './src' //aquí le digo que muestre todos los archivos que esten dentro de la carpeta src
  });

  //Preparamos al servidor para que se quede escuchando por cambios, y si encuentra cambios que se reinicie por si solo
  gulp.watch([
    'node_modules/bootstrap/scss/bootstrap.min.scss',
    'src/scss/*.scss'
  ], ['sass']);//aquí le decimos que tarea se va a encargar de convertirlo ['sass']

  gulp.watch('src/*.html').on('change', browserSync.reload);//aquí le decimos que se quede escuchando a ver si hay cambios en los archivos .html, si hay cambios el servidor se reiniciara solo.

});

//copio los archivo de font-awesome de font-awesome.min.css a mi carpeta 'src/css' para poder utilizarlos
// (bootstrap 4 no posee iconos, con la librería 'font-awesome' obtengo los iconos)
gulp.task('font-awesome', () => {
  return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
  .pipe(gulp.dest('src/css'));
})

// node_modules/font-awesome/fonts/ -> fuentes de font-awesome
// creamos la tarea fonts para copiar los archivos que estan en 'node_modules/font-awesome/fonts/*' a 'src/fonts'
gulp.task('fonts', () => {
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('src/fonts'));
});

//aquí ejecuto las tareas, cuando ejecuto el comando gulp, por defecto se ejecutaran todas las tareas que cree ('js', 'serve', 'font-awesome', 'fonts')
gulp.task('default', ['js', 'serve', 'font-awesome', 'fonts'])
