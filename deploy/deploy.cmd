@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off
echo Deployment switchboard:

CALL :endpoint_%ENDPOINT_TYPE%
if "%ERRORLEVEL%" NEQ "0" CALL :default

echo Deployment switchboard complete.
goto deploy_end

:endpoint_client
  echo Deploying client endpoint.
  copy /Y "deploy\deploy.client.cmd" "deploy.client.cmd"
	deploy.client.cmd
  goto end
:endpoint_server
  echo Deploying server endpoint.
  copy /Y "deploy\deploy.server.cmd" "deploy.server.cmd"
  call deploy.server.cmd
  goto end
:endpoint_docs
  echo Deploying docs endpoint.
  copy /Y "deploy\deploy.docs.cmd" "deploy.docs.cmd"
  call deploy.docs.cmd
  goto end
:default 
  echo You have to set the ENDPOINT_TYPE setting to 'client', 'server', or 'docs'
  goto end
:end
  VER > NUL 
  echo Deployment complete!
  goto :EOF

:deploy_end
endlocal
echo Deployment ended successfully.