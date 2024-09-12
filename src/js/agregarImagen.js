import { Dropzone } from 'dropzone';

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube Tus Imágenes Aquí',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    dictMaxFilesExceeded: 'El límite es de 1 archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function(){
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar');

        btnPublicar.addEventListener('click', function(){
            console.log('Botón Publicar clickeado');
            dropzone.processQueue(); 
        });
        
        
        dropzone.on('queuecomplete', function(){
            alert('Archivo subido correctamente');
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = '/mis-productos';
            }
        });
    }
};
