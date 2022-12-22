ECHO OFF
ECHO Servidor ejecutandose...

CALL background.vbs

ECHO Ejecutaremos una peticion al servidor para verificar que se encuentre en linea. 

TIMEOUT 10 /NOBREAK

curl -I http://192.168.120.70:3001/api/v1/checklist

PAUSE


