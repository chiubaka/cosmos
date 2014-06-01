@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off
echo Deployment switchboard:

CALL :endpoint_%ENDPOINT_TYPE%
if "%ERRORLEVEL%" NEQ "0" CALL :default

echo Deployment switchboard complete.
exit /b 1

:endpoint_client
  echo Deploying client endpoint.
	call deploy\deploy.client.cmd
  goto end
:endpoint_server
  echo Deploying server endpoint.
  call deploy\deploy.server.cmd
  goto end
:endpoint_docs
  echo Deploying docs endpoint.
  call deploy\deploy.docs.cmd
  goto end
:default 
  echo You have to set the ENDPOINT_TYPE setting to 'client', 'server', or 'docs'
  goto end
:end
  VER > NUL 
  echo Deployment complete!
  goto :EOF
